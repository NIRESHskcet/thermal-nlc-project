/**
 * Client-side export helpers (CSV, Excel-compatible, print/PDF).
 */

function escapeCsvCell(value) {
    const str = value == null ? "" : String(value);
    if (/[",\n\r]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function rowsToMatrix(columns, data) {
    const headers = columns.filter((c) => c.key !== "actions" && c.key !== "select").map((c) => c.label);
    const keys = columns.filter((c) => c.key !== "actions" && c.key !== "select").map((c) => c.key);
    const rows = data.map((row) =>
        keys.map((key) => {
            const col = columns.find((c) => c.key === key);
            if (col?.exportValue) return col.exportValue(row);
            if (col?.render) {
                const raw = row[key];
                return raw != null ? raw : "";
            }
            return row[key] ?? "";
        })
    );
    return { headers, rows };
}

export function exportToCsv(filename, columns, data) {
    const { headers, rows } = rowsToMatrix(columns, data);
    const lines = [headers.map(escapeCsvCell).join(",")];
    rows.forEach((r) => lines.push(r.map(escapeCsvCell).join(",")));
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, `${filename}.csv`);
}

/** Opens in Excel when saved as .xls (HTML table) */
export function exportToExcel(filename, columns, data) {
    const { headers, rows } = rowsToMatrix(columns, data);
    let html = "<table><thead><tr>";
    headers.forEach((h) => {
        html += `<th>${escapeHtml(h)}</th>`;
    });
    html += "</tr></thead><tbody>";
    rows.forEach((row) => {
        html += "<tr>";
        row.forEach((cell) => {
            html += `<td>${escapeHtml(cell)}</td>`;
        });
        html += "</tr>";
    });
    html += "</tbody></table>";
    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
    downloadBlob(blob, `${filename}.xls`);
}

export function exportToPdf(title, columns, data) {
    const { headers, rows } = rowsToMatrix(columns, data);
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        alert("Please allow pop-ups to export PDF.");
        return;
    }
    let tableHtml = "<table border='1' cellpadding='6' cellspacing='0' style='border-collapse:collapse;width:100%;font-size:12px'>";
    tableHtml += "<thead><tr>";
    headers.forEach((h) => {
        tableHtml += `<th style="background:#eef2f6">${escapeHtml(h)}</th>`;
    });
    tableHtml += "</tr></thead><tbody>";
    rows.forEach((row) => {
        tableHtml += "<tr>";
        row.forEach((cell) => {
            tableHtml += `<td>${escapeHtml(cell)}</td>`;
        });
        tableHtml += "</tr>";
    });
    tableHtml += "</tbody></table>";

    printWindow.document.write(`
        <!DOCTYPE html><html><head><title>${escapeHtml(title)}</title>
        <style>
          body { font-family: Segoe UI, sans-serif; padding: 24px; color: #334155; }
          h1 { font-size: 18px; margin-bottom: 8px; }
          .meta { font-size: 12px; color: #64748b; margin-bottom: 16px; }
        </style></head><body>
        <h1>${escapeHtml(title)}</h1>
        <p class="meta">Generated ${new Date().toLocaleString()}</p>
        ${tableHtml}
        </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
    }, 300);
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function escapeHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function printHtmlReport(title, bodyHtml) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        alert("Please allow pop-ups to print.");
        return;
    }
    printWindow.document.write(`
        <!DOCTYPE html><html><head><title>${escapeHtml(title)}</title>
        <style>
          body { font-family: Segoe UI, sans-serif; padding: 24px; color: #334155; }
          h1 { font-size: 18px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
          th { background: #f1f5f9; }
        </style></head><body>
        <h1>${escapeHtml(title)}</h1>
        <p style="color:#64748b;font-size:12px">${new Date().toLocaleString()}</p>
        ${bodyHtml}
        </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
}
