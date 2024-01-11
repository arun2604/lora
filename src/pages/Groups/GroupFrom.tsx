import { Box, Button, Grid, InputLabel, MenuItem, Modal, OutlinedInput, Select, Snackbar, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Group.css';
import { Field, Form, Formik } from 'formik';
import * as yup from "yup";
import { Theme, useTheme } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../../Redux/Store';
import { getDeviceDetails } from '../../Redux/Thunks/DeviceThunks';
import { createGroup, getAllGroups, updateGroupDetails } from '../../Redux/Thunks/GroupThunk';
import { getSelectedDevices } from '../../Redux/Slices/GroupSlice';
import BouncyButton from '../../components/shared/Button/ButtonComponent';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
};

const buutonStyle = {
    width: '95%',
}

function GroupFromModal(props: any) {
    const { handleClose, openModel, id, setId, setSnackBarMessage, setShowSnackBar } = props;
    const dispatch = useAppDispatch();
    const navigate: any = useNavigate();
    const { groupAllDetail, selectedDevices }: any = useAppSelector(state => state.groups);
    const { devices }: any = useAppSelector(state => state.device);
    const [dropDownName, setDropDownName] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState<any>([]);
    function getStyles(name: string, id: [], theme: Theme) {
        return {
            fontWeight:
                selectedDevice.includes(id)
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
            backgroundColor:
                selectedDevice.includes(id)
                    ? theme.palette.grey[400]
                    : 'transparent',
            color: selectedDevice.includes(id) ? '#3a3b3a' : ''
        };
    }
    if (devices && devices.length > 0 && dropDownName.length < devices.length) {
        let newNames: any = dropDownName;
        devices.map((device: any) => {
            newNames.push({ id: device.deviceId, name: device.name })
        })
        setDropDownName(newNames);
    }
    useEffect(() => {
        if (id > Number(0)) {
            dispatch(getSelectedDevices())
        } else {
            setSelectedDevice([]);
        }
    }, [id])

    useEffect(() => {
        setSelectedDevice(selectedDevices)
        if (id < 1) {
            setSelectedDevice([]);
        }
    }, [selectedDevices])

    const theme = useTheme();

    useEffect(() => {
        dispatch(getDeviceDetails());

        if (id < 1) {
            setSelectedDevice([])
        }
    }, [])

    const createSchema = yup.object({
        name: yup.string().trim().min(3, 'Please enter atleast three letters').required("Group name is required"),
    });

    let initialValues = {
        name: id != 0 ? groupAllDetail.groupDetails.name : "",
        devices: ['']
    };

    const handleChange = (event: any) => {
        const {
            target: { value },
        } = event;
        setSelectedDevice(value);
    };
    return (
        <Box>
            <Modal
                open={openModel}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <Box sx={style}>
                        <div className='headingContainer'>
                            <h2>{id > 0 ? 'Update' : 'Add'} Group</h2>
                        </div>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={createSchema}
                            onSubmit={async (values: any) => {
                                const selectedDevicesArray: any[] = [];
                                selectedDevice.forEach((deviceId: any) => {
                                    const selectedDeviceObject: any = dropDownName.find((item: any) => item.id === deviceId);
                                    if (selectedDeviceObject) {
                                        selectedDevicesArray.push({ ...selectedDeviceObject, isDeleted: false });
                                    }
                                });
                                values.devices = selectedDevicesArray;
                                if (id > 0) {
                                    let deleted: any = []
                                    deleted = selectedDevices.filter((element: any) => {
                                        let deleted = selectedDevice.includes(element);
                                        return !deleted && element
                                    });
                                    deleted.forEach((item: any) => {
                                        for (let i of devices) {
                                            if (i.deviceId === item) {
                                                values.devices = [...values.devices, { id: i.deviceId, name: i.name, isDeleted: true }]
                                            }
                                        }
                                    })
                                    let params = {
                                        id: id,
                                        details: {
                                            name: values.name,
                                            members: values.devices
                                        }
                                    }
                                    console.log(params)
                                    let res = await dispatch(updateGroupDetails(params));
                                    if (res.payload.status) {
                                        navigate('/group');
                                        values.name = '';
                                        values.devices = [];
                                        handleClose();
                                        dispatch(getAllGroups());
                                        setId(0);
                                    }
                                    if (res.payload.message) {
                                        setSnackBarMessage(res.payload.message);
                                        setShowSnackBar(true)
                                    }
                                }
                                else {
                                    if (values.devices.length > 0) {
                                        let res = await dispatch(createGroup(values))
                                        if (res.payload.status) {
                                            navigate('/group');
                                            values.name = '';
                                            values.devices = [];
                                            handleClose();
                                            dispatch(getAllGroups());
                                            setId(0);
                                        }
                                        if (res.payload.message) {
                                            setSnackBarMessage(res.payload.message);
                                            setShowSnackBar(true)
                                        }
                                    }
                                    else {
                                        setSnackBarMessage('please add atleast one device');
                                        setShowSnackBar(true)
                                    }
                                }
                            }}
                            enableReinitialize
                        >
                            {({ errors, touched, handleSubmit }) => (
                                <Form>
                                    <div className='formContainer'>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={12}>
                                                <div className='inputBox'>
                                                    <Field
                                                        as={TextField}
                                                        name="name"
                                                        label="Group Name"
                                                        variant="outlined"
                                                        error={errors.name && touched.name}
                                                        helperText={errors.name && touched.name && errors.name}
                                                        fullWidth
                                                    />
                                                </div>
                                                <div className='dropDown'>
                                                    <InputLabel id="demo-multiple-name-label">Devices</InputLabel>
                                                    <Field
                                                        as={Select}
                                                        fullWidth
                                                        labelId="demo-multiple-name-label"
                                                        placeholder=''
                                                        id="demo-multiple-name"
                                                        multiple
                                                        value={selectedDevice}
                                                        onChange={handleChange}
                                                        error={errors.devices && touched.devices}
                                                        helperText={errors.devices && touched.devices && errors.devices}
                                                        input={<OutlinedInput label="Name" />}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {dropDownName.map((name: any) => {
                                                            return (
                                                                <MenuItem
                                                                    key={name.id}
                                                                    value={name.id}
                                                                    style={getStyles(name.name, name.id, theme)}
                                                                >
                                                                    {name.name}
                                                                </MenuItem>
                                                            )
                                                        })}
                                                    </Field>
                                                </div>
                                            </Grid>
                                            <Grid className="center" item xs={12}>
                                                <BouncyButton title={id > 0 ? 'Update' : 'Submit'} onClick={handleSubmit} style={buutonStyle} />
                                                {/* <Button className='groupBtn' variant="contained" color="primary" type="submit">
                                                    {id > 0 ? 'Update' : 'Submit'}
                                                </Button> */}
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default GroupFromModal;
