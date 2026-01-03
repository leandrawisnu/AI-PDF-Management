import { useState, useEffect } from 'react';
import { pdfApi, summaryApi } from '../lib/api';

// Hook for fetching PDF and summary counts
export const useStats = (autoRefresh = false, refreshInterval = 30000) => {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalSummaries: 0,
    loading: true,
    error: null
  });

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));
      
      const [pdfCountResponse, summaryCountResponse] = await Promise.all([
        pdfApi.getPDFCount(),
        summaryApi.getSummaryCount()
      ]);
      
      setStats({
        totalDocuments: pdfCountResponse.count || 0,
        totalSummaries: summaryCountResponse.count || 0,
        loading: false,
        error: null
      });
    } catch (err) {
      setStats(prev => ({
        ...prev,
        loading: false,
        error: err.message
      }));
    }
  };

  const refreshStats = () => {
    fetchStats();
  };

  useEffect(() => {
    fetchStats();
    
    if (autoRefresh) {
      const interval = setInterval(fetchStats, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  return {
    ...stats,
    refreshStats
  };
};

// Hook for fetching detailed summary statistics
export const useSummaryStats = () => {
  const [stats, setStats] = useState({
    totalSummaries: 0,
    byLanguage: { english: 0, indonesian: 0 },
    byStyle: { short: 0, general: 0, detailed: 0 },
    averageProcessingTime: 0,
    loading: true,
    error: null
  });

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await summaryApi.getStats();
      
      setStats({
        totalSummaries: response.totalSummaries || 0,
        byLanguage: response.byLanguage || { english: 0, indonesian: 0 },
        byStyle: response.byStyle || { short: 0, general: 0, detailed: 0 },
        averageProcessingTime: response.averageProcessingTime || 0,
        loading: false,
        error: null
      });
    } catch (err) {
      // Fallback to count endpoint if stats endpoint fails
      try {
        const countResponse = await summaryApi.getSummaryCount();
        setStats({
          totalSummaries: countResponse.count || 0,
          byLanguage: { english: 0, indonesian: 0 },
          byStyle: { short: 0, general: 0, detailed: 0 },
          averageProcessingTime: 0,
          loading: false,
          error: null
        });
      } catch (countErr) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: countErr.message
        }));
      }
    }
  };

  const refreshStats = () => {
    fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    ...stats,
    refreshStats
  };
};