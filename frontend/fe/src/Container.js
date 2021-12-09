import React from "react";

// @material-ui/core
import {makeStyles} from "@material-ui/core/styles";

// core components
import GridItem from "./components/Grid/GridItem.js";
import GridContainer from "./components/Grid/GridContainer.js";

import Card from "./components/Card/Card.js";
import CardHeader from "./components/Card/CardHeader.js";
import CardFooter from "./components/Card/CardFooter.js";

import styles from "./assets/jss/material-dashboard-react/views/dashboardStyle.js";
import {
    Button,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent, DialogContentText,
    DialogTitle, InputAdornment, InputLabel, OutlinedInput,

} from "@material-ui/core";

import axios from "axios";
import FormControl from "@material-ui/core/FormControl";

axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-type": "application/json"
    }
});

const useStyles = makeStyles(styles);

export default function Container() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        if (outputImage === undefined) {
            return
        }
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const [inputImage, setInputImage] = React.useState(null);
    const [outputImage, setOutputImage] = React.useState(null);
    const [downloadNameInput, setDownloadNameInput] = React.useState('');

    function upload(formData) {
        let url = "http://localhost:5000/upload";

        axios.post(url, formData, {})
            .then(res => {
                let bytestring = res.data.img
                let image = bytestring.split('\'')[1]
                setOutputImage('data:image/jpeg;base64,' + image);
            })
    }

    function download() {
        if (outputImage === undefined) {
            return
        }
        var newFilename = (downloadNameInput !== '' ? downloadNameInput : "output") + '.jpeg'
        var dl = document.createElement('a');
        dl.setAttribute('href', outputImage);
        dl.setAttribute('download', newFilename);
        dl.click();
        handleClose()
    }

    let uploadFile = (evt) => {
        if (evt.target.files && evt.target.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                setInputImage(e.target.result)
            };
            reader.readAsDataURL(evt.target.files[0]);
            let fd = new FormData();
            fd.append('file', evt.target.files[0]);
            upload(fd)
        }
    }

    const classes = useStyles();
    return (
        <div>
            <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                    <Card>
                        <CardHeader color="warning" stats icon>
                         <h2 className={classes.cardTitle}>Normal</h2>
                        </CardHeader>
                        <CardMedia
                            component="img"
                            src={inputImage}
                             className={classes.cardMedia}
                        />
                        <CardFooter stats>
                            <div className={classes.stats}>
                                <input type="file" onChange={(evt) => {
                                    uploadFile(evt)
                                }}
                                       accept="image/gif, image/jpeg, image/png"/>
                            </div>
                        </CardFooter>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                    <Card>
                        <CardHeader color="success" stats icon>
                            <h2 className={classes.cardTitle}>GREYSCALE</h2>
                        </CardHeader>
                        <CardMedia
                            className={classes.cardMedia}
                            component="img"
                            src={outputImage}
                        />
                        <CardFooter stats>
                            <Button variant="outlined" color="primary" onClick={handleOpen}>Download</Button>
                            <Dialog
                                open={open}
                                onClose={handleClose}
                            >
                                <DialogTitle>Download file name</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Define your image name and it will be saved with .jpeg suffix. Otherwise
                                        output.jpeg if empty.
                                    </DialogContentText>
                                    <br/>
                                    <FormControl variant="outlined">
                                    <InputLabel htmlFor="filename">Filename</InputLabel>
                                    <OutlinedInput
                                        id="filename"
                                        label="Filename"
                                        type="text"
                                        variant="outlined"
                                        value={downloadNameInput}
                                        onChange={(event) => setDownloadNameInput(event.target.value)}
                                        endAdornment={<InputAdornment position="end">.jpeg</InputAdornment>}
                                    />
                                    </FormControl>
                                </DialogContent>
                                <DialogActions>
                                    <Button color="primary" onClick={download}>Download</Button>
                                    <Button onClick={handleClose}>Cancel</Button>
                                </DialogActions>
                            </Dialog>
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}