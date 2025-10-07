'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production and in the browser
    if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
      return;
    }

    const metrics: PerformanceMetrics = {};

    // Measure Core Web Vitals
    const measureWebVitals = () => {
      // First Contentful Paint
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry;
      if (fcpEntry) {
        metrics.fcp = fcpEntry.startTime;
      }

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      }

      // Report metrics
      if (Object.keys(metrics).length > 0) {
        console.log('Performance Metrics:', metrics);
        
        // Send to analytics (replace with your analytics service)
        if (window.gtag) {
          Object.entries(metrics).forEach(([metric, value]) => {
            window.gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: metric.toUpperCase(),
              value: Math.round(value),
              non_interaction: true,
            });
          });
        }
      }
    };

    // Use PerformanceObserver for better metrics
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Report metrics after page load
      setTimeout(measureWebVitals, 2000);
    } else {
      // Fallback for browsers without PerformanceObserver
      setTimeout(measureWebVitals, 2000);
    }

    // Cleanup function
    return () => {
      // Disconnect observers if they exist
      // Note: In a real implementation, you'd store observer references
    };
  }, []);

  return null; // This component doesn't render anything
}

// Use existing gtag declaration from analytics.ts
