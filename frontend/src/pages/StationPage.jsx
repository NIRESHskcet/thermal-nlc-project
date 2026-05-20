import { useCallback, useEffect, useState } from "react";
import AlertMessage from "../components/common/AlertMessage";
import BootstrapModal from "../components/common/BootstrapModal";
import BulkActionBar from "../components/common/BulkActionBar";
import ConfirmModal from "../components/common/ConfirmModal";
import ExportDropdown from "../components/common/ExportDropdown";
import FieldError from "../components/common/FieldError";
import LoadingSpinner from "../components/common/LoadingSpinner";
import PageToolbar from "../components/common/PageToolbar";
import SelectableDataTable from "../components/common/SelectableDataTable";
import { useBulkSelection } from "../hooks/useBulkSelection";
import { useConfirmDelete } from "../hooks/useConfirmDelete";
import { useCrudHandlers } from "../hooks/useCrudHandlers";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { usePermissions } from "../hooks/usePermissions";
import { stationService } from "../services/stationService";
import { getFieldError } from "../utils/validationErrors";

const emptyStation = {
    stationName: "",
    location: "Neyveli",
    primaryFuelType: "",
};

function StationPage() {
    const { isReadOnly } = usePermissions();
    const { toast, handleError } = useCrudHandlers();
    const bulk = useBulkSelection("stationId");
    const { confirmState, requestDelete, close, confirm } = useConfirmDelete();

    const [stations, setStations] = useState([]);
    const [form, setForm] = useState(emptyStation);
    const [fieldErrors, setFieldErrors] = useState({});
    const [editId, setEditId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const debouncedKeyword = useDebouncedValue(keyword);

    const loadStations = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = debouncedKeyword.trim()
                ? await stationService.search(debouncedKeyword.trim())
                : await stationService.getAll();
            setStations(response.data);
            bulk.clear();
        } catch (err) {
            setError(err.message || "Failed to load stations");
        } finally {
            setLoading(false);
        }
    }, [debouncedKeyword]);

    useEffect(() => {
        loadStations();
    }, [loadStations]);

    const openModal = (station = null) => {
        setFieldErrors({});
        setEditId(station?.stationId ?? null);
        setForm(
            station
                ? {
                      stationName: station.stationName || "",
                      location: station.location || "Neyveli",
                      primaryFuelType: station.primaryFuelType || "",
                  }
                : { ...emptyStation }
        );
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditId(null);
        setForm({ ...emptyStation });
        setFieldErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setFieldErrors({});
            if (editId) {
                await stationService.update(editId, form);
                toast.success("Station updated successfully.");
            } else {
                await stationService.create(form);
                toast.success("Station added successfully.");
            }
            closeModal();
            await loadStations();
        } catch (err) {
            handleError(err, setFieldErrors, setError);
        }
    };

    const deleteOne = (id) => {
        requestDelete({
            message: "Delete this station? Related units may be affected.",
            onConfirm: async () => {
                await stationService.remove(id);
                toast.success("Station deleted.");
                await loadStations();
            },
        });
    };

    const bulkDelete = () => {
        requestDelete({
            title: "Delete selected stations",
            message: `Delete ${bulk.count} station(s)?`,
            onConfirm: async () => {
                await Promise.all(bulk.selectedIds.map((id) => stationService.remove(id)));
                toast.success(`${bulk.count} station(s) deleted.`);
                await loadStations();
            },
        });
    };

    const tableColumns = [
        { key: "stationId", label: "ID" },
        { key: "stationName", label: "Station Name" },
        { key: "location", label: "Location" },
        { key: "primaryFuelType", label: "Fuel Type" },
    ];

    const columns = isReadOnly
        ? tableColumns
        : [
              ...tableColumns,
              {
                  key: "actions",
                  label: "Actions",
                  render: (row) => (
                      <div className="d-flex gap-1">
                          <button type="button" className="btn btn-sm btn-warning" onClick={() => openModal(row)}>
                              Edit
                          </button>
                          <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteOne(row.stationId)}>
                              Delete
                          </button>
                      </div>
                  ),
              },
          ];

    return (
        <div className="fade-in-up">
            <PageToolbar
                title="Stations"
                subtitle="Manage power plant stations"
                searchValue={keyword}
                onSearchChange={setKeyword}
                onAdd={isReadOnly ? undefined : () => openModal()}
                addLabel="Add Station"
                readOnly={isReadOnly}
                extraActions={
                    <ExportDropdown
                        filename="stations"
                        title="Stations"
                        columns={tableColumns}
                        data={stations}
                    />
                }
            />

            <AlertMessage message={error} onClose={() => setError("")} />

            <BulkActionBar count={bulk.count} onClear={bulk.clear}>
                {!isReadOnly && (
                    <button type="button" className="btn btn-sm btn-danger" onClick={bulkDelete}>
                        Delete selected
                    </button>
                )}
            </BulkActionBar>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <SelectableDataTable
                    columns={columns}
                    data={stations}
                    rowKey="stationId"
                    readOnly={isReadOnly}
                    selectedIds={bulk.selectedIds}
                    onToggleOne={bulk.toggleOne}
                    onToggleAll={bulk.toggleAll}
                />
            )}

            <ConfirmModal
                show={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={confirm}
                onClose={close}
            />

            <BootstrapModal
                show={modalOpen}
                title={editId ? "Edit Station" : "Add Station"}
                onClose={closeModal}
                footer={
                    <>
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            {editId ? "Update" : "Save"}
                        </button>
                    </>
                }
            >
                <div className="mb-3">
                    <label className="form-label">Station Name</label>
                    <input
                        className={`form-control ${getFieldError(fieldErrors, "stationName") ? "is-invalid" : ""}`}
                        name="stationName"
                        value={form.stationName}
                        onChange={handleChange}
                    />
                    <FieldError error={getFieldError(fieldErrors, "stationName")} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                        className={`form-control ${getFieldError(fieldErrors, "location") ? "is-invalid" : ""}`}
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                    />
                    <FieldError error={getFieldError(fieldErrors, "location")} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Primary Fuel Type</label>
                    <input
                        className={`form-control ${getFieldError(fieldErrors, "primaryFuelType") ? "is-invalid" : ""}`}
                        name="primaryFuelType"
                        value={form.primaryFuelType}
                        onChange={handleChange}
                    />
                    <FieldError error={getFieldError(fieldErrors, "primaryFuelType")} />
                </div>
            </BootstrapModal>
        </div>
    );
}

export default StationPage;
