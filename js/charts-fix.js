/**
 * Chart Fix — Reconstructs dashboard charts after minifier broke them
 */
(function() {
  'use strict';

  function fixCharts() {
    if (typeof Chart === 'undefined') {
      setTimeout(fixCharts, 500);
      return;
    }

    // ===== DASHBOARD CHARTS =====
    const dashContainer = document.getElementById('dashboard-view');
    if (!dashContainer) return;

    // Spending Trend Line Chart
    const spendingCanvas = dashContainer.querySelector('#spending-chart, canvas[data-chart="spending"]');
    if (spendingCanvas && !spendingCanvas._chart) {
      const ctx = spendingCanvas.getContext('2d');
      spendingCanvas._chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],
          datasets: [
            {
              label: 'Monthly Expenses',
              data: [52000,48000,55000,62000,58000,65000,61000,59000,64000,68000,72000,70000],
              borderColor: '#0f766e',
              backgroundColor: 'rgba(15,118,110,0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 3
            },
            {
              label: 'Income',
              data: [100000,100000,105000,100000,100000,110000,100000,100000,115000,100000,100000,120000],
              borderColor: '#14b8a6',
              backgroundColor: 'transparent',
              borderDash: [5,5],
              tension: 0.4,
              pointRadius: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8 } } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: v => '₹' + (v/1000).toFixed(0) + 'K' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // Expense Breakdown Doughnut
    const expenseCanvas = dashContainer.querySelector('#expense-chart, canvas[data-chart="expense"]');
    if (expenseCanvas && !expenseCanvas._chart) {
      const ctx = expenseCanvas.getContext('2d');
      expenseCanvas._chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Housing','Food','Transport','Utilities','Entertainment','Healthcare','Others'],
          datasets: [{
            data: [25000,12000,8000,6000,5000,4000,10000],
            backgroundColor: ['#0f766e','#14b8a6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#94a3b8'],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 11 } } } }
        }
      });
    }

    // ===== PORTFOLIO CHART =====
    const portContainer = document.getElementById('portfolio-view');
    if (portContainer) {
      const allocCanvas = portContainer.querySelector('#allocation-chart, canvas[data-chart="allocation"]');
      if (allocCanvas && !allocCanvas._chart) {
        const ctx = allocCanvas.getContext('2d');
        allocCanvas._chart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Equity (35%)','Debt (28%)','Real Estate (25%)','Gold (7%)','Cash (5%)'],
            datasets: [{
              data: [35,28,25,7,5],
              backgroundColor: ['#0f766e','#14b8a6','#f59e0b','#ef4444','#94a3b8'],
              borderWidth: 2,
              borderColor: '#fff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } }
          }
        });
      }
    }

    // ===== WEALTH TWIN CHART =====
    const twinContainer = document.getElementById('wealth-twin-view');
    if (twinContainer) {
      const netCanvas = twinContainer.querySelector('#net-worth-chart, canvas[data-chart="networth"]');
      if (netCanvas && !netCanvas._chart) {
        const ctx = netCanvas.getContext('2d');
        netCanvas._chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['2024','2025','2026','2027','2028','2029','2030','2031','2032','2033','2034'],
            datasets: [{
              label: 'Projected Net Worth (₹)',
              data: [45,52,61,72,85,101,120,142,168,198,235].map(v => v * 100000),
              borderColor: '#0f766e',
              backgroundColor: 'rgba(15,118,110,0.1)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { ticks: { callback: v => '₹' + (v/10000000).toFixed(1) + 'Cr' } },
              x: { grid: { display: false } }
            }
          }
        });
      }
    }
  }

  // Run when DOM is ready and after a short delay for the minified app to render
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(fixCharts, 800));
  } else {
    setTimeout(fixCharts, 800);
  }

  // Also re-run on view navigation
  const origRenderView = window.App && window.App.renderView;
  if (origRenderView) {
    window.App.renderView = function(view) {
      origRenderView.call(window.App, view);
      setTimeout(fixCharts, 600);
    };
  }
})();
