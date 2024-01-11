import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { deleteDevice, getByIdDeviceDetails, getDeviceDetails } from "../../Redux/Thunks/DeviceThunks";
import { useAppDispatch, useAppSelector } from "../../Redux/Store";
import DeviceFormModal from "./DeviceFormModal";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModel from "../../components/shared/DeleteModel";
import TitleBar from "../../components/shared/TitleBar";
import IconButton from "@mui/material/IconButton";
import DataTable from "../../components/shared/DataTable";
import Loader from "../../components/shared/Loading/Loader";

const DeviceList = () => {
  const dispatch = useAppDispatch();

  const [openModel, setOpenModel] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  const { devices, device, isLoading } = useAppSelector((state) => state.device);

  useEffect(() => {
    getDeviceList();
  }, []);

  const getDeviceList = async () => {
    await dispatch(getDeviceDetails());
  };

  const ActionButtonRenderer = (props: any) => {
    return (
      <Box>
        <IconButton title="Edit Device" onClick={() => onEdit(props.data.deviceId)}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="Delete Device" title="Delete Device" onClick={() => onDeleteClick(props.data.deviceId)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    );
  };

  const onEdit = (id: number) => {
    dispatch(getByIdDeviceDetails(id))
      .then((res) => {
        if (res.payload.status) {
          setSelectedId(id);
          setOpenModel(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onDeleteClick = (id: number) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const onDelete = async (id: number) => {
    const res = await dispatch(deleteDevice(id));
    if (res.payload.status) {
      let getDeviceDetailsResult = await dispatch(getDeviceDetails());
      if (getDeviceDetailsResult.payload.status) {
        setShowDeleteModal(false);
        setSelectedId(0);
      }
    }
  };

  const refreshDataTable = async () => {
    await dispatch(getDeviceDetails());
  };

  const closeModal = () => {
    setOpenModel(false);
    setSelectedId(0);
  };

  const columnDefs: ColDef[] = [
    { field: "name", headerName: "Device Name" },
    { field: "APIKey", headerName: "Api Key" },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: ActionButtonRenderer,
    },
  ];

  return (
    <Box>
      <TitleBar
        title="Devices"
        buttons={[
          {
            title: "Add Device",
            handleClick: () => setOpenModel(true),
          },
          {
            title: "Refresh",
            handleClick: () => refreshDataTable(),
          },
        ]}
      />
      <div className="container-fluid">
        <DataTable rows={devices} columnDefs={columnDefs} />
        <DeviceFormModal openModel={openModel} handleClose={closeModal} device={device} editId={selectedId} />
        <DeleteModel
          text="Are you sure want to delete device?"
          showModal={showDeleteModal}
          setShowModal={setShowDeleteModal}
          onConfirm={onDelete}
          id={selectedId}
        />
      </div>
      <Loader open={isLoading} />
    </Box>
  );
};

export default DeviceList;
