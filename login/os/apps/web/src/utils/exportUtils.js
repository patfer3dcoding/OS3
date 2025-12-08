export function exportToCSV(data, filename) {
    if (!data || !data.length) {
        console.warn("No data to export");
        return;
    }

    // Get headers from first object keys
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        headers.join(","), // Header row
        ...data.map(row =>
            headers.map(header => {
                let cell = row[header] === null || row[header] === undefined ? "" : row[header];
                // Handle strings that contain commas or newlines
                if (typeof cell === 'string' && (cell.includes(',') || cell.includes('\n') || cell.includes('"'))) {
                    cell = `"${cell.replace(/"/g, '""')}"`;
                }
                return cell;
            }).join(",")
        )
    ].join("\n");

    // Create downloadable blob
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
