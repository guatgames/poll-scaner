import cv2
import numpy as np
from PIL import Image
import io

class SurveyScanner:
    def __init__(self):
        # Mapeo de preguntas y opciones válidas
        self.questions_config = {
            "q1": ["A", "B", "C"],
            "q2": ["A", "B", "C", "D"],
            "q3": ["A", "B", "C", "D"],
            "q4": ["A", "B", "C", "D"],
            "q5": ["A", "B", "C", "D"]
        }

    def process_image(self, image_bytes: bytes):
        """
        Procesa la imagen escaneada combinando detección de color HSV (resaltadores celestes/azules)
        y umbralizado adaptativo (lapicero/checkmarks/marcas).
        """
        # Convertir bytes a OpenCV Image
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        img_np = np.array(image)
        img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

        # Normalizar tamaño para coordenadas consistentes
        h_orig, w_orig = img_bgr.shape[:2]
        target_width = 800
        target_height = int(h_orig * (target_width / w_orig))
        resized = cv2.resize(img_bgr, (target_width, target_height))

        # 1. Máscara HSV para resaltador celeste / azul brillante
        hsv = cv2.cvtColor(resized, cv2.COLOR_BGR2HSV)
        lower_blue = np.array([85, 40, 40])
        upper_blue = np.array([135, 255, 255])
        blue_mask = cv2.inRange(hsv, lower_blue, upper_blue)

        # 2. Umbral Adaptativo para tinta/lapicero/marcas oscuras
        gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        adaptive_thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY_INV, 15, 4
        )

        # Regiones relativas verticales aproximadas para las 5 preguntas en la hoja
        # [q1, q2, q3, q4, q5]
        q_regions_y = [
            (0.44, 0.51), # Q1
            (0.53, 0.60), # Q2
            (0.62, 0.69), # Q3
            (0.71, 0.78), # Q4
            (0.80, 0.87)  # Q5
        ]

        detected_answers = {}
        confidence_scores = {}

        for idx, (q_key, options) in enumerate(self.questions_config.items()):
            y_start_pct, y_end_pct = q_regions_y[idx]
            y1 = int(target_height * y_start_pct)
            y2 = int(target_height * y_end_pct)
            
            # Sub-región horizontal donde se ubican las casillas [A, B, C, D]
            x1 = int(target_width * 0.28)
            x2 = int(target_width * 0.60)

            crop_blue = blue_mask[y1:y2, x1:x2]
            crop_adaptive = adaptive_thresh[y1:y2, x1:x2]

            num_opts = len(options)
            opt_width = crop_blue.shape[1] // num_opts

            best_option = options[0]
            max_score = -1

            for o_idx, opt_letter in enumerate(options):
                ox1 = o_idx * opt_width
                ox2 = (o_idx + 1) * opt_width

                cell_blue = crop_blue[:, ox1:ox2]
                cell_adaptive = crop_adaptive[:, ox1:ox2]

                # Puntuación combinada: Azul resaltador + Trazo oscuro de lapicero
                blue_score = np.sum(cell_blue > 0)
                adaptive_score = np.sum(cell_adaptive > 0)
                
                total_score = (blue_score * 2.5) + adaptive_score

                if total_score > max_score:
                    max_score = total_score
                    best_option = opt_letter

            detected_answers[q_key] = best_option
            # Evaluar nivel de confianza
            confidence_scores[q_key] = min(98.0, round(float(max_score / 150.0), 1))

        return {
            "answers": detected_answers,
            "confidence": confidence_scores,
            "status": "success"
        }

scanner_service = SurveyScanner()