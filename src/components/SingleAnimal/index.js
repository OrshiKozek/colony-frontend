import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AppBar, Box, Breadcrumbs, Button, Card, CardContent, CardMedia, Checkbox, Container, CssBaseline, Divider, Grid, FormControl, IconButton, Input, InputLabel, Link, List, ListItem, ListItemText, MenuItem, Popover, Select, Snackbar, Tab, Tabs, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useProfileProvider } from 'contexts/profile';
import PopupState, { bindHover, bindPopover } from 'material-ui-popup-state';
import InfoIcon from '@material-ui/icons/Info';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Uploader from 'components/ImageUpload';
import Modal from '@material-ui/core/Modal';

import Image from 'material-ui-image'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import DeleteIcon from "@material-ui/icons/Delete";
import Carousel from 'react-elastic-carousel';

const { getList } = require('components/Tags/index');

const numRegex = RegExp('^\\d*$');

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  primary: {
    color: 'black',
  },
  error: {
    color: 'red',
  },
  popover: {
    pointerEvents: 'none',
  },
  error: {
    color: 'red',
  },
}));

const useStyles2 = makeStyles(theme => ({
  table: {
    width: '100%',
    minWidth: 500,
    marginTop: 8,
  },
  paper: {
    width: '100%',
    padding: theme.spacing(2, 4, 3),
    outline: 0,
  },
  root: {
    display: 'flex',
  },
  sidebar: {
    display: 'block',
    width: '15%',
    height: 'auto',
    float: 'left',
    alignItems: 'center',
    padding: '5px 5px 5px 5px',
  },
  slideshowButton: {
    width: '120px',
    height: '40px',
    margin: 'auto',
    display: 'block',
    borderRadius: '4px',
    fontSize: '14px',
  },
  details: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 500,
  },
  controls: {
    display: 'flex',
    alignItems: 'right',
    alignContent: 'right',
    alignSelf: 'flex-end',
    float: 'right',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  notes: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: 'auto',
    marginLeft: '5%',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 800,
    height: 800,
    margin: 'auto',
  },
  modal_paper: {
    backgroundColor: theme.palette.background.paper,
  },
  carousel: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
  }
}));

const useStylesTag = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 325,
  },
}));

const gridStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    display: 'inline-block',
  },
}));

//formatting for the tag box
const ITEM_HEIGHT = 75;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(tag, tagList, theme) {
  if(tag === undefined){
    return;
  }
  return {
    fontWeight:
      tagList.indexOf(tag) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const defaultTags = getList().sort();

function displayTags(tags){
  if(typeof tags === 'object'){
    return tags.join(', ');
  }
  else{
    return('');
  }
}

const SingleAnimal = (props) => {
  const classes = useStyles();
  const classesTwo = useStyles2();
  const classesGrid = gridStyles();
  const themeTag = useTheme();
  const classesTag = useStylesTag();

  const {
    logout, editAnimal, storeNote, storeEvent, addNewToTag, searchAnimals, deleteImageLink, state,
  } = useProfileProvider();
  const { accessRights } = state;
  const currentAnimal = props.location.state.animal;
  const [redirectToAnimals, setRedirectToAnimals] = useState(false);
  const [redirectToColonies, setRedirectToColonies] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const { colonyName, colonyId, geneNames } = state;
  const [notes, setNotes] = useState('');
  const [event, setEvent] = useState('');
  const [date, setDate] = useState('');
  const [open, setOpen] = React.useState(false);
  const [notesOpen, setNotesOpen] = React.useState(false);
  const [eventOpen, setEventOpen] = React.useState(false);
  const [selectedTags, setselectedTags] = React.useState([]);
  const [selectedImage, setselectedImage] = React.useState({});
  const [openSlide, setSlideOpen] = React.useState(false);
  const [openModal, setModalOpen] = React.useState(false);
  const [selectedList, setSelectedList] = React.useState([]);
  const [deleteDialog, setDeleteOpen] = React.useState(false);

  const [animalInfo, setAnimalInfo] = useState({});

  const [fatherMouse, setFatherMouse] = useState({});
  const [motherMouse, setMotherMouse] = useState({});
  const [errors, setErrors] = useState({});

  const [tagList, setTagList] = React.useState([]);
  const [isDefault, setDefault] = useState(false);
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  currentAnimal.imageLinks
    .splice(0, currentAnimal.imageLinks.length, ...(new Set(currentAnimal.imageLinks)));

  const animalNotes = currentAnimal.notes.filter((item, index) => currentAnimal.notes.indexOf(item) === index);

  const animalEvents = currentAnimal.events.filter((item, index) => currentAnimal.events.indexOf(item) === index);

  const animalImages = currentAnimal.imageLinks.filter((item, index) => currentAnimal.imageLinks.indexOf(item) === index);

  animalNotes.sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  animalEvents.sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  animalImages.sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  const imageBuckets = [];
  const separate = (list) => {
    if(list === undefined || list.length <= 0){
      return null;
    }
    else{
      var key = list[0].date;
      var temp = [];
      list.forEach(element => {
        if(element.date === key){
          temp.push(element);
        }
        else{
          key = element.date;
          imageBuckets.push(temp);
          temp = [element];
        }
      });
      imageBuckets.push(temp);
    }
  }
  separate(animalImages);

  const handleTagChange = (event) => {
    setselectedTags(event.target.value);
  }

  const addTagToAnimal = (newTags) => {
      if(typeof currentAnimal.tags !== "object"){
        currentAnimal.tags = [];
      }
      newTags.forEach(function(item){
        if(typeof currentAnimal.tags === "object" && !currentAnimal.tags.includes(item)){
          currentAnimal.tags.push(item);
        }
      });

      setTagList(currentAnimal.tags);
    }

  const defaultTraits = (id, gen, litt, mo, da, yr, deathMo, deathDa, deathYr, fth, mth, gn1, gn2, gn3, tod, tags) => {
    setAnimalInfo(prevState => ({ ...prevState, mouseId: id }));
    setAnimalInfo(prevState => ({ ...prevState, gender: gen }));
    setAnimalInfo(prevState => ({ ...prevState, litter: litt }));
    setAnimalInfo(prevState => ({ ...prevState, dobMonth: mo }));
    setAnimalInfo(prevState => ({ ...prevState, dobDay: da }));
    setAnimalInfo(prevState => ({ ...prevState, dobMonth: mo }));
    setAnimalInfo(prevState => ({ ...prevState, dodYear: yr }));
    setAnimalInfo(prevState => ({ ...prevState, dodMonth: deathMo }));
    setAnimalInfo(prevState => ({ ...prevState, dodDay: deathDa }));
    setAnimalInfo(prevState => ({ ...prevState, dodYear: deathYr }));
    setAnimalInfo(prevState => ({ ...prevState, fatherId: fth }));
    setAnimalInfo(prevState => ({ ...prevState, motherId: mth }));
    setAnimalInfo(prevState => ({ ...prevState, gene1: gn1 }));
    setAnimalInfo(prevState => ({ ...prevState, gene2: gn2 }));
    setAnimalInfo(prevState => ({ ...prevState, gene3: gn3 }));
    setAnimalInfo(prevState => ({ ...prevState, tod: tod }));

    setDefault(true);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleNotesClick = () => {
    setNotesOpen(true);
  };

  const handleNotesClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setNotesOpen(false);
  };

  const handleEventClick = () => {
    setEventOpen(true);
  };

  const handleEventClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setEventOpen(false);
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const deleteAndClose = () => {
    deleteChosenImage(currentAnimal.animalUUID);
    setDeleteOpen(false);
    setModalOpen(false);
  }

  const deleteChosenImage = async (animalId) => {
    const imageObject = selectedImage;
    setselectedImage({});
    const request = {
      colonyId, animalId, imageObject
    };
    await deleteImageLink(request).catch(function(error) {
      console.error(error);
    });
  };

  const getErrors = () => {
    var errorString = "";
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => errorString = errorString + val + "\n"
    );
    return errorString;
  }

  const validateForm = () => {
    let valid = true;

    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }
  const defaultGenes = ["+/+", "+/-", "-/-"];

  const checkGenes = async (name, value, motherId, fatherId) => {
      var valid = true;

      var animals = await searchAnimals({colonyId, searchCriteria: {mouseId: fatherId}}).catch(function(error) {
        console.error(error);
      });
      const father = animals[0];
      const fatherGene = father[name];

      var animals = await searchAnimals({colonyId, searchCriteria: {mouseId: motherId}}).catch(function(error) {
        console.error(error);
      });
      const mother = animals[0];
      const motherGene = mother[name];

      if (fatherGene && motherGene) {
        if (value === '+/-') {
            valid = fatherGene !== motherGene || fatherGene === '+/-';
        }
        else if (value === '-/-') {
            valid = motherGene.includes('-') && fatherGene.includes('-');
        }
        else if (value === '+/+') {
            valid = motherGene.includes('+') && fatherGene.includes('+');
        }

      setErrors(prevState => ({...prevState, [name]:
        valid
        ? ''
        : `Check ${geneNames[name]}: ${value} invalid for father ${geneNames[name]} of ${fatherGene} and mother ${geneNames[name]} of ${motherGene}`}));
    }
  }

  const checkAllGenes = (motherId, fatherId) => {
    if (animalInfo.gene1) {
      checkGenes('gene1', animalInfo.gene1, motherId, fatherId);
    }
    if (animalInfo.gene2) {
      checkGenes('gene2', animalInfo.gene2, motherId, fatherId);
    }
    if (animalInfo.gene3) {
      checkGenes('gene3', animalInfo.gene3, motherId, fatherId);
    }
  }

  const updateInput = async ({ target: { name, value } }) => {
    switch(name) {
      case 'gene1':
      case 'gene2':
      case 'gene3':
        if (animalInfo.motherId && animalInfo.fatherId && !errors.motherId && !errors.fatherId) {
          checkGenes(name, value, animalInfo.motherId, animalInfo.fatherId);
        }
        break;
      case 'fatherId':
        if (!numRegex.test(value)) {
          setErrors(prevState => ({...prevState, [name]:
          'Father ID should be numeric.'}));
        }
        else {
          const criteria = {gender: 'M', mouseId: value};
          const searchInfo = {colonyId, searchCriteria: criteria};
          const animals = await searchAnimals(searchInfo).catch(function(error) {
            console.error(error);
          });
          setErrors(prevState => ({...prevState, [name]:
            animals.length !== 0
            ? ''
            : `Check father ID: Male mouse with ID ${value} not found in colony ${colonyName}`}));
          if (animals.length !== 0) {
            setFatherMouse(animals[0]);
          }
        }
        if (name == 'motherId' && !errors.motherId && !errors.fatherId) {
          checkAllGenes(animalInfo.motherId, value);
        }
        break;
      case 'motherId':
        if (!numRegex.test(value)) {
          setErrors(prevState => ({...prevState, [name]:
          'Mother ID should be numeric.'}));
        }
        else {
          const criteria = {gender: 'F', mouseId: value};
          const searchInfo = {colonyId, searchCriteria: criteria};
          const animals = await searchAnimals(searchInfo).catch(function(error) {
            console.error(error);
          });
          setErrors(prevState => ({...prevState, [name]:
            animals.length !== 0
            ? ''
            : `Check mother ID: Female mouse with ID ${value} not found in colony ${colonyName}`}));
          if (animals.length !== 0) {
            setMotherMouse(animals[0]);
          }
        }
        if (name == 'fatherId' && !errors.motherId && !errors.fatherId) {
          checkAllGenes(value, animalInfo.fatherId);
        }
        break;
      case 'mouseId':
        setErrors(prevState => ({...prevState, [name]:
          numRegex.test(value)
          ? ''
          : 'Mouse ID should be numeric.'}));
        break;
      }

      setAnimalInfo(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSlideOpen = (list) => {
    setSelectedList(list);
    setSlideOpen(true);
  };

  const handleSlideClose = () => {
    setSlideOpen(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const saveChanges = async (event) => {
    event.preventDefault();

    addTagToAnimal(selectedTags);

    const animal = {
      animalUUID: currentAnimal.animalUUID,
      mouseId: animalInfo.mouseId,
      gender: animalInfo.gender,
      litter: animalInfo.litter,
      dobMonth: animalInfo.dobMonth,
      dobDay: animalInfo.dobDay,
      dobYear: animalInfo.dobYear,
      dodMonth: animalInfo.dodMonth,
      dodDay: animalInfo.dodDay,
      dodYear: animalInfo.dodYear,
      fatherId: animalInfo.fatherId,
      motherId: animalInfo.motherId,
      notes: animalNotes,
      events: animalEvents,
      gene1: animalInfo.gene1,
      gene2: animalInfo.gene2,
      gene3: animalInfo.gene3,
      imageLinks: currentAnimal.imageLinks,
      tod: animalInfo.tod,
      tags: currentAnimal.tags,
    };

    console.log(animal);

    if (validateForm()) {
      const request = { animal, colonyId };
      editAnimal(request);

      currentAnimal.tags.forEach(item => {
        const tagData = { tagName: item, mouse: currentAnimal.animalUUID};
        addNewToTag(tagData);
      });

      handleClick();
    }
  };

  const defaultLink = 'https://d17fnq9dkz9hgj.cloudfront.net/uploads/2012/11/106564123-rats-mice-care-253x169.jpg';

  const avatarLink = currentAnimal.imageLinks.length !== 0 ? currentAnimal.imageLinks[0].url : defaultLink;

  const onEventsAdded = (event) => {
    setEvent(event.target.value);
  }

  const onDateAdded = (date) => {
    setDate(date.target.value);
  }

  const onNotesAdded = (event) => {
    setNotes(event.target.value);
  };

  const onSaveNotes = () => {
    const note = { notes, timestamp: Date.now() };
    const myNotes = { colonyId, animalId: currentAnimal.animalUUID, note };
    storeNote(myNotes);
    handleNotesClick();
  };

  const onSaveEvent = () => {
    const currEvent = { event, timestamp: new Date(date + " 00:00:00").getTime()};
    const myEvent = { colonyId, animalId: currentAnimal.animalUUID, eventInfo: currEvent };
    console.log(myEvent);
    storeEvent(myEvent);
    handleEventClick();
  };

  const convertTimeStamp = timestamp => (new Date(timestamp)).toLocaleString();

  if (redirectToAnimals) {
    return <Redirect to="/dashboard/colony" />;
  } else if (redirectToColonies) {
    return <Redirect to="/dashboard" />;
  } else if (redirectToLogin) {
    logout();
    return <Redirect to="/" />;
  }

  function parentInfo(name) {
    var mouse = {};
    if (name==='father-info') {
      mouse = fatherMouse;
    }
    else {
      mouse = motherMouse;
    }

    if (mouse) {
      return <>
      <PopupState variant="popover" popupId={name}>
      {(popupState) => (
        <>
          <InfoIcon {...bindHover(popupState)}>
          </InfoIcon>
          <Popover
          {...bindPopover(popupState)}
          className={classes.popover}
          classes={{
            paper: classes.paper,
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          disableRestoreFocus
        >
          <Card className={classes.root}>
            <div className={classes.content}>
              <CardContent className={classes.details}>
                <Typography gutterBottom variant="h5" component="h2">
                  ID: {mouse.mouseId}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  <strong>DOB:</strong> {mouse.dobMonth || '??'}/{mouse.dobDay || '??'}/{mouse.dobYear || '????'}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  <strong>DOD:</strong> {mouse.dodMonth || '??'}/{mouse.dodDay || '??'}/{mouse.dodYear || '????'}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  <strong>{geneNames.gene1 || 'Gene 1'}:</strong> {mouse.gene1}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  <strong>{geneNames.gene2 || 'Gene 2'}:</strong> {mouse.gene2}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  <strong>{geneNames.gene3 || 'Gene 3'}:</strong> {mouse.gene3}
                </Typography>
              </CardContent>
            </div>
          </Card>
          </Popover>
          </>
      )}
    </PopupState>
    </>
  }
}

  return (
    <div>
      {
        isDefault ?
          null :
          defaultTraits(currentAnimal.mouseId, currentAnimal.gender, currentAnimal.litter, currentAnimal.dobMonth, currentAnimal.dobDay, currentAnimal.dobYear, currentAnimal.dodMonth, currentAnimal.dodDay, currentAnimal.dodYear, currentAnimal.fatherId, currentAnimal.motherId, currentAnimal.gene1, currentAnimal.gene2, currentAnimal.gene3, currentAnimal.tod, currentAnimal.tags)}
      <div className={classes.root} style={{ textAlign: 'left' }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link color="inherit" onClick={() => setRedirectToLogin(true)}>
            Logout
          </Link>
          <Link color="inherit" onClick={() => setRedirectToColonies(true)}>
            Colonies
          </Link>
          <Link color="inherit" onClick={() => setRedirectToAnimals(true)}>
            {colonyName}
          </Link>
          <Link
            color="textPrimary"
            aria-current="page"
          >
            {currentAnimal.mouseId}
          </Link>
        </Breadcrumbs>
      </div>
      <Container component="main">
        <CssBaseline />
        <div className={classesTwo.paper}>
          <Card className={classesTwo.root}>
            <CardMedia
              className={classesTwo.cover}
              image={avatarLink}
              title="Rat"
            />
            <CardContent className={classes.form}>
              <form className={classes.form} noValidate>
                {
                  accessRights ?
                    <div className={classesGrid.root}>
                      <>
                      {
                        currentAnimal.fileErrors ?
                        <>
                          <Typography className={classes.error}> Errors found in file: </Typography>
                          <ul className={classes.error}>
                            {currentAnimal.fileErrors.map((error) => <li key={error}> {error} </li>)}
                          </ul>
                        </>
                        : null
                      }
                      </>
                      <Grid container>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              label="ID"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="mouseId"
                              defaultValue={currentAnimal.mouseId}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                          <InputLabel id="gender-label">Gender</InputLabel>
                          <Select
                            labelId="gender-label"
                            name="gender"
                            variant="outlined"
                            size="small"
                            value={animalInfo.gender || currentAnimal.gender || ''}
                            onChange={updateInput}
                          >
                            <MenuItem value={undefined}>NA</MenuItem>
                            <MenuItem value={"M"}>(M)ale</MenuItem>
                            <MenuItem value={"F"}>(F)emale</MenuItem>
                            </Select>
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              label="tod"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="tod"
                              defaultValue={currentAnimal.tod}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              label="Birth month"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="dobMonth"
                              defaultValue={currentAnimal.dobMonth}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              label="Birth day"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="dobDay"
                              defaultValue={currentAnimal.dobDay}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              label="Birth year"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="dobYear"
                              defaultValue={currentAnimal.dobYear}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              label="Death month"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="dodMonth"
                              defaultValue={currentAnimal.dodMonth}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              label="Death day"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="dodDay"
                              defaultValue={currentAnimal.dodDay}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              label="Death year"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="dodYear"
                              defaultValue={currentAnimal.dodYear}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              label="Litter"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="litter"
                              defaultValue={currentAnimal.litter}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              label="Father ID"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="fatherId"
                              defaultValue={currentAnimal.fatherId}
                              onChange={updateInput}
                            />
                            {parentInfo('father-info')}
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              label="Mother ID"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="motherId"
                              defaultValue={currentAnimal.motherId}
                              onChange={updateInput}
                            />
                            {parentInfo('mother-info')}
                          </div>
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                          <InputLabel id="gene1-label">{geneNames.gene1}</InputLabel>
                            <Select
                              labelId="gene1-label"
                              variant="outlined"
                              size="small"
                              name="gene1"
                              value={animalInfo.gene1 || currentAnimal.gene1}
                              onChange={updateInput}
                            >
                            <MenuItem value={undefined}>NA</MenuItem>
                            {defaultGenes.map(gene => (
                                <MenuItem key={defaultGenes.indexOf(gene)} value={gene}>{gene}</MenuItem>
                              ))}
                            </Select>
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                          <InputLabel id="gene2-label">{geneNames.gene2}</InputLabel>
                          <Select
                            label="gene2-label"
                            variant="outlined"
                            size="small"
                            name="gene2"
                            value={animalInfo.gene2 || currentAnimal.gene2}
                            onChange={updateInput}
                          >
                          <MenuItem value={undefined}>NA</MenuItem>
                          {defaultGenes.map(gene => (
                              <MenuItem key={defaultGenes.indexOf(gene)} value={gene}>{gene}</MenuItem>
                            ))}
                          </Select>
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                          <InputLabel id="gene3-label">{geneNames.gene3}</InputLabel>
                          <Select
                            labelId="gene3-label"
                            variant="outlined"
                            size="small"
                            name="gene3"
                            value={animalInfo.gene3 || currentAnimal.gene3}
                            onChange={updateInput}
                          >
                          <MenuItem value={undefined}>NA</MenuItem>
                          {defaultGenes.map(gene => (
                              <MenuItem key={defaultGenes.indexOf(gene)} value={gene}>{gene}</MenuItem>
                            ))}
                          </Select>
                          </div>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid item xs>
                          <div>
                            <FormControl className={classesTag.formControl}>
                              <InputLabel
                                id="tag-label"
                              >Tags</InputLabel>
                              <Select
                                labelId="tag-label"
                                id="multiple-tag"
                                multiple
                                value={selectedTags}
                                onChange={handleTagChange}
                                input={<Input id="select-multiple-tag"/>}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                              >
                                {defaultTags.map((tag) => (
                                  <MenuItem key={tag} value={tag} style={getStyles(tag, selectedTags, themeTag)}>
                                    <Checkbox checked={selectedTags.indexOf(tag) > -1} />
                                    <ListItemText primary={tag} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                          <TextField
                            disabled
                            id="outlined-multiline-static"
                            label="Applied Tags"
                            multiline
                            rows={4}
                            style={{width:'40ch',}}
                            defaultValue={displayTags(currentAnimal.tags)}
                            variant="outlined"
                          />
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                    :
                    <div className={classesGrid.root}>
                      <Grid container>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              disabled
                              label="ID"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="mouseId"
                              defaultValue={currentAnimal.mouseId}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                          <InputLabel id="gender-label">Gender</InputLabel>
                          <Select
                            labelId="gender-label"
                            name="gender"
                            variant="outlined"
                            size="small"
                            value={animalInfo.gender || currentAnimal.gender || ''}
                            onChange={updateInput}
                          >
                            <MenuItem value={undefined}>NA</MenuItem>
                            <MenuItem value={"M"}>(M)ale</MenuItem>
                            <MenuItem value={"F"}>(F)emale</MenuItem>
                            </Select>
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              disabled
                              label="tod"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="tod"
                              defaultValue={currentAnimal.tod}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              disabled
                              label="Birth month"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="dobMonth"
                              defaultValue={currentAnimal.dobMonth}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              disabled
                              label="Birth day"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="dobDay"
                              defaultValue={currentAnimal.dobDay}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              disabled
                              label="Birth year"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="dobYear"
                              defaultValue={currentAnimal.dobYear}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              disabled
                              label="Death month"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="dodMonth"
                              defaultValue={currentAnimal.dodMonth}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              disabled
                              label="Death day"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="dodDay"
                              defaultValue={currentAnimal.dodDay}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              disabled
                              label="Death year"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="dodYear"
                              defaultValue={currentAnimal.dodYear}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              disabled
                              label="Litter"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="litter"
                              defaultValue={currentAnimal.litter}
                              onChange={updateInput}
                            />
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              disabled
                              label="Father ID"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="fatherId"
                              defaultValue={currentAnimal.fatherId}
                              onChange={updateInput}
                            />
                            {parentInfo('father-info')}
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              disabled
                              label="Mother ID"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="motherId"
                              defaultValue={currentAnimal.motherId}
                              onChange={updateInput}
                            />
                            {parentInfo('mother-info')}
                          </div>
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                          <InputLabel id="gene1-label">{geneNames.gene1}</InputLabel>
                          <Select
                            labelId="gene1-label"
                            variant="outlined"
                            size="small"
                            margin="normal"
                            name="gene1"
                            value={animalInfo.gene1 || currentAnimal.gene1}
                            onChange={updateInput}
                          >
                          <MenuItem value={undefined}>NA</MenuItem>
                          {defaultGenes.map(gene => (
                              <MenuItem value={gene}>{gene}</MenuItem>
                            ))}
                          </Select>
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                          <InputLabel id="gene2-label">{geneNames.gene2}</InputLabel>
                          <Select
                            labelId="gene2-label"
                            variant="outlined"
                            size="small"
                            margin="normal"
                            name="gene2"
                            value={animalInfo.gene2 || currentAnimal.gene2}
                            onChange={updateInput}
                          >
                          <MenuItem value={undefined}>NA</MenuItem>
                          {defaultGenes.map(gene => (
                              <MenuItem value={gene}>{gene}</MenuItem>
                            ))}
                          </Select>
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                          <InputLabel id="gene3-label">{geneNames.gene3}</InputLabel>
                          <Select
                            labelId="gene3-label"
                            variant="outlined"
                            size="small"
                            margin="normal"
                            name="gene3"
                            value={animalInfo.gene3 || currentAnimal.gene3}
                            onChange={updateInput}
                          >
                          <MenuItem value={undefined}>NA</MenuItem>
                          {defaultGenes.map(gene => (
                              <MenuItem value={gene}>{gene}</MenuItem>
                            ))}
                          </Select>
                          </div>
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item xs>
                        <div>
                            <FormControl className={classesTag.formControl}>
                              <InputLabel id="tag-label">Tags</InputLabel>
                              <Select
                                disabled
                                labelId="tag-label"
                                id="multiple-tag"
                                multiple
                                value={selectedTags}
                                onChange={handleTagChange}
                                input={<Input id="select-multiple-tag" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                              >
                                {defaultTags.map((tag) => (
                                  <MenuItem key={tag} value={tag} style={getStyles(tag, selectedTags, themeTag)}>
                                    <Checkbox checked={selectedTags.indexOf(tag) > -1} />
                                    <ListItemText primary={tag} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                        </Grid>
                        <Grid item xs>
                          <div className={classesGrid.paper}>
                            <TextField
                              disabled
                              label="currentTags"
                              variant="outlined"
                              size="small"
                              margin="normal"
                              name="currentTags"
                              defaultValue={currentAnimal.tags}
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                }
              </form>
              <div className={classes.error}>
                { !validateForm() ? getErrors() : null }

              </div>
              <div className={classesTwo.controls}>
                {
                  accessRights ?
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={saveChanges}
                    >Save Changes
                    </Button>
                    : null
                }
                <Button
                  onClick={() => {
                    setRedirectToAnimals(true);
                  }}
                  variant="outlined"
                  color="primary"
                >Back
                </Button>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity="success">
                    Changes saved successfully!
                  </Alert>
                </Snackbar>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={classesTwo.paper} style={{ flexDirection: 'column' }}>
          <AppBar position="static" style={{ background: 'white' }}>
            <Tabs value={tab} onChange={handleTabChange} aria-label="simple tabs example">
              <Tab label={<span style={{ color: 'black' }}>Notes</span>} {...a11yProps(0)} />
              <Tab label={<span style={{ color: 'black' }}>Gallery</span>} {...a11yProps(1)} />
              <Tab label={<span style={{ color: 'black' }}>Events</span>} {...a11yProps(2)} />
            </Tabs>

            <TabPanel value={tab} index={0}>
              <div>
                <TextField
                  id="filled-full-width"
                  label="Notes"
                  style={{ margin: 8 }}
                  className={classesTwo.textField}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  onChange={onNotesAdded}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Button variant="contained" color="primary" onClick={onSaveNotes}>
                  Save Notes
                  </Button>
                <Snackbar open={notesOpen} autoHideDuration={6000} onClose={handleNotesClose}>
                  <Alert onClose={handleNotesClose} severity="success">
                    Notes saved successfully!
                  </Alert>
                </Snackbar>
              </div>

              <div className={classes.root}>
                <List component="nav" aria-label="main mailbox folders">
                  {
                    animalNotes.map((note, index) => (
                      <div key={index}>
                        <ListItem button>
                          <ListItemText
                            primary={<Typography color="textPrimary">{note.notes}</Typography>}
                            secondary={convertTimeStamp(note.timestamp)}
                          />
                        </ListItem>
                        <Divider />
                      </div>
                    ))
                  }
                </List>
              </div>
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <Uploader animalId={currentAnimal.animalUUID} />
              { (imageBuckets.length > 0) && <div style={{height:'500px', overflow: 'auto'}}>
                {imageBuckets.map((sublist) => (
                  <div key={imageBuckets.indexOf(sublist)}>
                    <hr style={{width:'100%', borderTop: '2px solid #ccc', borderRadius: '2px'}}/>
                    <div className={classesTwo.root} style={{width: '100%', marginTop: '1%'}}>
                      <div className={classesTwo.sidebar}>
                        <p style={{fontSize:'15px', color: 'black', textAlign: 'center' }}><b>{sublist[0].date}</b></p>
                          {(sublist.length > 0) && <Button variant="contained" color="primary" className={classesTwo.slideshowButton} onClick={() => {
                                handleSlideOpen(sublist)
                              }}>Slideshow</Button>}
                      </div>
                      <div style={{width: '100%', marginLeft: '1%', borderLeft: '2px solid #ccc', paddingLeft: '1%'}}>
                        <GridList className={classesTwo.gridList} cols={8}>

                          {sublist.map((element) => (
                            <GridListTile
                              className={classesTwo.gridListTile}
                              key={sublist.indexOf(element)}
                              cols={1}
                              style={{ width: 100, height: 100}}
                              onClick={() => {
                                setselectedImage(element) 
                                handleModalOpen()
                              }}
                            >
                              <Image
                                style={{
                                  border: '1px solid #aaa',
                                  borderRadius: '4px',
                                  width: '100',
                                  height: 'auto',
                                }}
                                src={element.url}
                              >
                              </Image>
                            </GridListTile>
                          ))}
                        </GridList>
                      </div>
                    </div>
                  </div>
                ))}

                <Modal
                  className={classesTwo.modal}
                  open={openModal}
                  onClose={handleModalClose}
                >
                  <div
                    position='absolute'
                    className={classesTwo.modal_paper}
                  >
                    <img             
                      loading='lazy'
                      display='block'
                      width='600'
                      height='auto'
                      padding='10'
                      src={selectedImage.url}
                      alt={selectedImage.note}
                      />
                    <div style={{marginLeft: '10px'}}>
                      <p style={{ textAlign:'left', fontSize:'15px' }}>Photo Information</p>
                      <p style={{ textAlign:'left', fontSize:'12px' }}>Time: {convertTimeStamp(selectedImage.timestamp)}</p>
                      <p style={{ textAlign:'left', fontSize:'12px' }}>Note: {selectedImage.note}</p>
                    </div>
                    {
                    accessRights ?
                      <IconButton
                        aria-label="delete"
                        style={{marginLeft: '90%'}}
                        onClick={() => {
                          if (accessRights) {
                            handleDeleteOpen();
                          } else {
                            console.log('User does not have write access.');
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      : null
                    }
                  </div>
                </Modal>

                <Modal
                  className={classesTwo.modal}
                  open={openSlide}
                  onClose={handleSlideClose}
                  width='500'
                  height='500'
                >
                  <Carousel className={classesTwo.carousel}>
                    {selectedList.map((elem) => (
                      <div
                        key={selectedList.indexOf(elem)}
                        className={classesTwo.modal_paper}
                      >
                        <div width='600px' height='600px'>
                          <img
                            loading='lazy'
                            margin-left='10%'
                            margin-right='10%'
                            margin-top="auto"
                            width='600'
                            height='auto'
                            position='absolute'
                            border='2px solid #aaa' 
                            src={elem.url}
                            alt={elem.note}
                          />
                        </div>
                        <div style={{marginLeft: '10px'}}>
                          <p style={{ textAlign:'left', fontSize:'15px' }}>Photo Information</p>
                          <p style={{ textAlign:'left', fontSize:'12px' }}>Time: {convertTimeStamp(elem.timestamp)}</p>
                          <p style={{ textAlign:'left', fontSize:'12px' }}>Note: {elem.note}</p>
                        </div>
                      </div>
                    ))}
                  </Carousel>
                </Modal>
                
                <Dialog
                  open={deleteDialog}
                  onClose={handleDeleteClose}
                >
                  <DialogTitle>Confirm Delete</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to delete this image?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={deleteAndClose} color="primary">
                      Delete
                    </Button>
                    <Button onClick={handleDeleteClose} color="primary" autoFocus>
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
              }
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <div>
                <TextField
                    id="filled-full-width"
                    label="Event Info"
                    style={{ margin: 8 }}
                    className={classesTwo.textField}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    onChange={onEventsAdded}
                    InputLabelProps={{
                      shrink: true,
                    }}
                />

                <input type="date" id="event-time"
                  name="meeting-time"
                  onChange={onDateAdded}
                />

                <Button variant="contained" color="primary" onClick={onSaveEvent}>
                  Save Event
                  </Button>
                <Snackbar open={eventOpen} autoHideDuration={6000} onClose={handleEventClose}>
                  <Alert onClose={handleEventClose} severity="success">
                    Event saved successfully!
                  </Alert>
                </Snackbar>
              </div>

              <div className={classes.root}>
                <List component="nav" aria-label="main mailbox folders">
                  {
                    animalEvents.map((event, index) => (
                      <div key={index}>
                        <ListItem button>
                          <ListItemText
                            primary={<Typography color="textPrimary">{event.event}</Typography>}
                            secondary={convertTimeStamp(event.timestamp)}
                          />
                        </ListItem>
                        <Divider />
                      </div>
                    ))
                  }
                </List>
              </div>
            </TabPanel>
          </AppBar>
        </div>
      </Container>
    </div>
  );
};

export default SingleAnimal;
