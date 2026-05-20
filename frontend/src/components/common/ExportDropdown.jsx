import { useState } from "react";
import { exportToCsv, exportToExcel, exportToPdf } from "../../utils/exportUtils";

function ExportDropdown({ filename, title, columns, data, disabled }) {
    const [open, setOpen] = useState(false);

    if (!data?.length) {
        return (
            <button type="button" className="btn btn-outline-secondary btn-sm" disabled>
                Export
            </button>
        );
    }

    const run = (fn) => {
        fn(filename || title, columns, data);
        setOpen(false);
    };

    return (
        <div className="dropdown">
            <button
                type="button"
                className="btn btn-outline-secondary btn-sm dropdown-toggle"
                onClick={() => setOpen((o) => !o)}
                disabled={disabled}
            >
                Export
            </button>
            {open && (
                <ul className="dropdown-menu dropdown-menu-end show">
                    <li>
                        <button type="button" className="dropdown-item" onClick={() => run(exportToCsv)}>
                            CSV
                        </button>
                    </li>
                    <li>
                        <button type="button" className="dropdown-item" onClick={() => run(exportToExcel)}>
                            Excel (.xls)
                        </button>
                    </li>
                    <li>
                        <button type="button" className="dropdown-item" onClick={() => run(() => exportToPdf(title, columns, data))}>
                            PDF (Print)
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
}

export default ExportDropdown;
