import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../Redux/Store'
import { useSearchParams } from 'react-router-dom';
import { getAllGroups, getGroupDetails } from '../../Redux/Thunks/GroupThunk';
import { Delete } from "@mui/icons-material";
import { Card, CardContent, CardActions, Chip, Dialog, DialogActions, DialogContent, Fab, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { createMultipleGroupMembers, deleteGroupMember, getGroupMemberNotInGroup } from '../../Redux/Thunks/GroupMemberthunk';
import Button from '@mui/material/Button';
import MonitorIcon from '@mui/icons-material/Monitor';
import theme from '../../theme/theme';

function GroupDetails(props: any) {
    // const [searchParams] = useSearchParams();
    // const id = Number(searchParams.get("id")) || 0;
    const { id } = props
    const { groupMembers }: any = useAppSelector(state => state.groupMembers);

    useEffect(() => {
        dispatch(getGroupMemberNotInGroup(id))
    }, [])

    const dispatch = useAppDispatch()
    // useEffect(() => {
    //     dispatch(getGroupDetails(id));
    // }, [])
    const { groupAllDetail }: any = useAppSelector(state => state.groups);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [selectedDevices, setSelectedDevices] = useState<any>([]);
    const [memberToDelete, setMemberToDelete] = useState<any>('');

    const [open, setOpen] = React.useState(false);
    const [openDeleteDialouge, setOpenDeleteDialouge] = React.useState(false);

    const handleClickOpen = () => {
        dispatch(getGroupMemberNotInGroup(id))
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDevices([])
    };

    const handleChipClick = (member: any) => {
        if (!selectedDevices.includes(member.deviceId)) {
            setSelectedDevices((prev: any) => [...prev, member.deviceId])
        }
        else {
            let filtredDevices = selectedDevices.filter((dev: any) => dev != member.deviceId)
            setSelectedDevices(filtredDevices)
        }
    }

    const handleDeleteMember = (id: number) => {
        setMemberToDelete(id)
        setOpenDeleteDialouge(true)
    }

    const handleAddMember = async () => {
        if (selectedDevices.length < 1) {
            setSnackBarMessage('Please select any device to addd');
            setShowSnackBar(true)
            return;
        }
        let params = {
            selectedDevices,
            groupId: id
        }
        console.log(params);
        const data = await dispatch(createMultipleGroupMembers(params))
        if (data.payload.message) {
            setSnackBarMessage(`Device${selectedDevices.length > 1 ? 's' : ''} added in group `);
            setShowSnackBar(true)
        }
        if (data.payload.status) {
            handleClose()
            await dispatch(getGroupDetails(id));
            await dispatch(getGroupMemberNotInGroup(id));
            dispatch(getAllGroups());
            setSelectedDevices([])
        }
    }

    const deleteMember = (memberId: number) => {
        dispatch(deleteGroupMember(memberId)).then((data) => {
            if (data.payload.status) {
                setSnackBarMessage('Device deleted');
                setShowSnackBar(true)
                dispatch(getGroupDetails(id))
            }
            else {
                setSnackBarMessage(data.payload.message)
                setShowSnackBar(true)
            }
        }).catch((error) => console.log(error))
        setOpenDeleteDialouge(false)
        dispatch(getAllGroups());
    }

    return (
        <div className='detailsWrapper'>
            <div className='innerWrapper'>
                <div className='headingContainer'>
                    <h3 className='groupMemberTitle'>{groupAllDetail ? groupAllDetail.groupDetails ? groupAllDetail.groupDetails.name : '' : ''}</h3>
                    {
                        open &&
                        <div style={{ display: 'flex', marginRight: '5%' }}>
                            <div style={{ marginRight: '8%' }}>
                                <Button style={{ backgroundColor: 'transparent', color: 'blue' }} size='small' variant="outlined" onClick={handleClose} >Close</Button>
                            </div>
                            <div>
                                <Button style={{ backgroundColor: 'transparent', color: 'blue' }} size='small' variant="outlined" onClick={handleAddMember} autoFocus>Add</Button>
                            </div>
                        </div>
                    }
                </div>
                {!open ? <div className='memberOuterContainer'>
                    {groupAllDetail && groupAllDetail.memberDetails && groupAllDetail.memberDetails.map((member: any) => {
                        return (
                            <div className="membersContainer">
                                <Card sx={{ width: '100%' }}>
                                    <CardContent sx={{ width: '92%', height: '35px', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                        <div style={{ flex: 0.3, alignItems: 'center', display: 'flex', width: '100%', justifyContent: 'center' }}>
                                            <MonitorIcon />
                                        </div>
                                        <div className='member'>
                                            {member.deviceName}
                                        </div>
                                        <div style={{ flex: 0.3 }}>
                                            {!openDeleteDialouge ? <span
                                                className="icon"
                                                onClick={() => handleDeleteMember(member.groupMemberId)}
                                            >
                                                <Delete fontSize='small' color='error' />
                                            </span>
                                                : memberToDelete == member.groupMemberId ?
                                                    <div className='deleteButtonContainer'>
                                                        <div>Delete ?</div>
                                                        <div style={{ display: 'flex' }}>
                                                            <Button size='small' variant="text" onClick={() => deleteMember(memberToDelete)}>Yes</Button>
                                                            <Button size='small' variant="text" onClick={() => setOpenDeleteDialouge(false)}>No</Button>
                                                        </div>
                                                    </div>
                                                    : <span
                                                        className="icon"
                                                        onClick={() => handleDeleteMember(member.groupMemberId)}
                                                    >
                                                        <Delete fontSize='small' color='error' />
                                                    </span>}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )
                    })
                    }
                </div>
                    :
                    <div className='memberOuterContainer'>
                        {groupMembers && groupMembers.length > 0 ?
                            groupMembers.map((member: any) => {
                                let isSelected = selectedDevices.includes(member.deviceId);
                                return (
                                    <div className="membersContainer" onClick={() => handleChipClick(member)}>
                                        <Card sx={{ width: '100%', backgroundColor: isSelected ? 'blue' : '' }}>
                                            <CardContent sx={{ width: '92%', height: '35px', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                                <div style={{ flex: 0.3, alignItems: 'center', display: 'flex', width: '100%', justifyContent: 'center' }}>
                                                    <MonitorIcon sx={{ color: isSelected ? theme.palette.primary.contrastText : '' }} />
                                                </div>
                                                <div className='member' style={{ color: isSelected ? theme.palette.primary.contrastText : '' }}>
                                                    {member.name}
                                                </div>
                                                <div style={{ flex: 0.3 }}>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            })
                            :
                            <div>No devices found to add</div>
                        }
                    </div>
                }
            </div>
            {
                !open && <div className='fab' onClick={handleClickOpen}>
                    <Fab color="primary" aria-label="add">
                        <AddIcon />
                    </Fab>
                </div>
            }
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
                        color: "White",
                        zIndex: 1009
                    },
                }}
            />
        </div >
    )
}

export default GroupDetails
