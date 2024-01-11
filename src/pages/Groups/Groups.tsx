import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/Store';
import { deleteGroups, getAllGroups, getGroupDetails } from '../../Redux/Thunks/GroupThunk';
import './Group.css';
import { ColDef } from "ag-grid-community";
import IconButton from '@mui/material/IconButton';
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteModel from '../../components/shared/DeleteModel';
import GroupFromModal from './GroupFrom';
import Sheet from 'react-modal-sheet';
import { GroupsModel } from '../../models/GroupsModel';
import GroupDetails from './GroupDetails';
import PageHeading from '../../components/shared/PageHeading';
import BouncyButton from '../../components/shared/Button/ButtonComponent';
import DataTable from '../../components/shared/DataTable';
import Loader from '../../components/shared/Loading/Loader';
import TitleBar from '../../components/shared/TitleBar';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Groups = () => {
    const dispatch = useAppDispatch();
    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const navigate: any = useNavigate();
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [openModel, setOpenModel] = useState(false);
    const [openDeleteDialouge, setOpenDeleteDialouge] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>([]);
    const [clickedGroup, setClickedGroup] = useState<any>();
    let { groups, isLoading } = useAppSelector(state => state.groups);
    let { isLoading: isLoadingMembers } = useAppSelector(state => state.groupMembers);
    let newGroups = groups.map((group: GroupsModel) => {
        return { ...group, createdOn: new Date(group.createdOn).toDateString(), updatedOn: group.updatedOn ? new Date(group.updatedOn).toDateString() : 'null' }
    })
    groups = newGroups;

    useEffect(() => {
        dispatch(getAllGroups());
    }, []);

    const refreshDataTable = () => {
        dispatch(getAllGroups());
    }

    const ActionButtonRenderer = (props: any) => {
        return (
            <Box >
                <IconButton aria-label="Edit" onClick={() => handleEditGroup(props.data.groupId)}>
                    <CreateIcon fontSize='small' color='primary' />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => dialogBoxDelete(props.data.groupId)}>
                    <DeleteIcon fontSize='small' color='error' />
                </IconButton>
            </Box>
        );
    };

    const GroupNameRenderer = (props: any) => {
        return (
            <Box >
                <Box aria-label="Group Name" title="Group Name" onClick={() => handleGroupCLick(props.data.groupId)}>
                    {props.data.name}
                </Box>
            </Box>
        );
    };

    const DateRenderer = (props: any) => {
        return (
            <Box >
                <Box aria-label="Updated On" title="Updated On" onClick={() => handleGroupCLick(props.data.groupId)}>
                    {props.data.updatedOn != 'null' ? props.data.updatedOn : props.data.createdOn}
                </Box>
            </Box>
        );
    };

    const UserRenderer = (props: any) => {
        return (
            <Box >
                <Box aria-label="Updated By" title="Updated By" onClick={() => handleGroupCLick(props.data.groupId)}>
                    {props.data.updatedBy ? props.data.updatedBy : props.data.createdBy}
                </Box>
            </Box>
        );
    };

    const dialogBoxDelete = (id: number) => {
        setSelectedMember(id)
        setOpenDeleteDialouge(true)
    }

    const handleGroupCLick = (id: number) => {
        dispatch(getGroupDetails(id)).then((data: any) => {
            if (data.payload.status) {
                // navigate('/groupDetails?id=' + id)
                setBottomSheetOpen(true)
                setClickedGroup(id)
            }
            else {
                setSnackBarMessage(data.payload.message)
                setShowSnackBar(true)
            }
        })
    }

    const closeModal = () => {
        setOpenModel(false);
        setSelectedMember(0);
    };

    const handleEditGroup = (id: number) => {
        dispatch(getGroupDetails(id)).then((data: any) => {
            if (data.payload.status) {
                setSelectedMember(id)
                setOpenModel(true)
            }
            else {
                setSnackBarMessage(data.payload.message)
                setShowSnackBar(true)
            }
        })
    }

    const handleDeleteGroup = (id: number) => {
        dispatch(deleteGroups(id)).then((data) => {
            if (data.payload.status) {
                setSnackBarMessage('Group deleted')
                setShowSnackBar(true)
                dispatch(getAllGroups())
            }
        })
        setOpenDeleteDialouge(false)
    }

    const columnDefs: ColDef[] = [
        {
            field: "actions",
            headerName: "Actions",
            cellRenderer: ActionButtonRenderer,
        },
        { field: "name", headerName: "Group Name", cellRenderer: GroupNameRenderer },
        { field: "memberCount", headerName: "Member Count" },
        { field: "createdBy", headerName: "Last Updated By", cellRenderer: UserRenderer },
        { field: "createdOn", headerName: "Last Updated On", cellRenderer: DateRenderer },
    ];

    const createDevice = () => {
        setOpenModel(true);
    }

    return (
        <Box className='wrapper'>
            <TitleBar
                title="Groups"
                buttons={[
                    {
                        title: "Add Group",
                        handleClick: () => createDevice(),
                    },
                    {
                        title: "Refresh",
                        handleClick: () => refreshDataTable(),
                    },
                ]}
            />
            <div className="container-fluid">
                <DataTable rows={groups} columnDefs={columnDefs} />
                {openModel && <GroupFromModal setShowSnackBar={setShowSnackBar} setSnackBarMessage={setSnackBarMessage} handleClose={closeModal} openModel={openModel} id={selectedMember} setId={setSelectedMember} />}
                <DeleteModel
                    text='Are you sure want to delete ?'
                    showModal={openDeleteDialouge}
                    setShowModal={setOpenDeleteDialouge}
                    onConfirm={async () => handleDeleteGroup(selectedMember)}
                    id={selectedMember}
                />
                <Snackbar
                    open={showSnackBar}
                    autoHideDuration={2000}
                    onClose={() => setShowSnackBar(false)}
                    message={snackBarMessage}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    ContentProps={{
                        sx: {
                            display: "block",
                            textAlign: "center",
                            color: "white",
                        },
                    }}
                />
            </div>
            <Sheet
                style={{ zIndex: 1009 }}
                isOpen={isBottomSheetOpen} onClose={() => setBottomSheetOpen(false)}>
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <GroupDetails id={clickedGroup} />
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>
            <Loader open={isLoading || isLoadingMembers} />
        </Box>
    );
}

export default Groups;
