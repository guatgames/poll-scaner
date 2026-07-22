import axios from 'axios';
import { type ScanResponse, type SurveyAnswers, type DashboardStats } from '../types/types';

const API_BASE = 'http://localhost:8000/api';

export const scanSurveyImage = async (file: File): Promise<ScanResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post<ScanResponse>(`${API_BASE}/scan`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const saveSurveyResult = async (answers: SurveyAnswers): Promise<void> => {
  await axios.post(`${API_BASE}/surveys/save`, answers);
};

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axios.get<DashboardStats>(`${API_BASE}/dashboard/stats`);
  return response.data;
};