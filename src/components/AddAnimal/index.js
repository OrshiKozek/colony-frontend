import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useProfileProvider } from 'contexts/profile';
import { Button, Breadcrumbs, Card, CardContent, Link, TextField, Grid, Container, CssBaseline, Typography, Select, MenuItem, InputLabel, Popover } from '@material-ui/core';
import PopupState, { bindHover, bindPopover } from 'material-ui-popup-state';
import InfoIcon from '@material-ui/icons/Info';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { makeStyles } from '@material-ui/core/styles';

const numRegex = RegExp('^\\d*$');

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    color: 'red',
  },
  popover: {
    pointerEvents: 'none',
  },
  typography: {
    subtitle1: {
      fontSize: 12,
    },
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

const AddAnimal = () => {
  const classesGrid = gridStyles();
  const classesTwo = useStyles2();
  const classes = useStyles();
  const { logout, addAnimal, searchAnimals, state } = useProfileProvider();
  const [animalInfo, setAnimalInfo] = useState({});
  const [fatherMouse, setFatherMouse] = useState({});
  const [motherMouse, setMotherMouse] = useState({});
  const [errors, setErrors] = useState({});
  const [redirectToAnimals, setRedirectToAnimals] = useState(false);
  const [redirectToColonies, setRedirectToColonies] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const { colonyName, colonyId, geneNames } = state;

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

  const attemptAddAnimal = (event) => {
    // TODO: Check for 401 and redirect if 200.
    event.preventDefault();
    if (validateForm()) {
      const request = { animal: animalInfo, colonyId };
      addAnimal(request);
      setRedirectToAnimals(true);
    }
  };

  const defaultGenes = ["+/+", "+/-", "-/-"];

  const checkGenes = async (name, value, motherId, fatherId) => {
      var valid = true;

      var animals = await searchAnimals({colonyId, searchCriteria: {animalInfo: {mouseId: fatherId}}, tags: []}).catch(function(error) {
        console.error(error);
      });
      const father = animals[0];
      const fatherGene = father[name];

      var animals = await searchAnimals({colonyId, searchCriteria: {animalInfo: {mouseId: motherId}}, tags: []}).catch(function(error) {
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
          const searchInfo = {colonyId, searchCriteria: {animalInfo: criteria}, tags: []};
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
        if (animalInfo.motherId && !errors.motherId && !errors.fatherId) {
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
          const searchInfo = {colonyId, searchCriteria: {animalInfo: criteria}, tags:[]};
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
        if (animalInfo.fatherId && !errors.motherId && !errors.fatherId) {
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
        </Breadcrumbs>
      </div>

      <Container component="main">
        <CssBaseline />
        <div className={classesTwo.paper}>
          <Typography component="h1" variant="h5">
            Add Animal to {colonyName}
          </Typography>

          <Card className={classesTwo.root}>
            <CardContent className={classes.form}>
            <form className={classes.form} noValidate>
                <div className={classesGrid.root}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                        <TextField
                          name="mouseId"
                          variant="outlined"
                          size="small"
                          margin="normal"
                          label="ID"
                          onChange={updateInput}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                        <InputLabel id="gender-label">Gender</InputLabel>
                        <Select
                          labelId="gender-label"
                          name="gender"
                          variant="outlined"
                          size="small"
                          value={animalInfo.gender || ''}
                          onChange={updateInput}
                        >
                          <MenuItem value={undefined}>NA</MenuItem>
                          <MenuItem value={"M"}>(M)ale</MenuItem>
                          <MenuItem value={"F"}>(F)emale</MenuItem>
                          </Select>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                        <TextField
                          name="tod"
                          variant="outlined"
                          size="small"
                          margin="normal"
                          label="TOD"
                          onChange={updateInput}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                        <TextField
                          name="dobMonth"
                          variant="outlined"
                          size="small"
                          margin="normal"
                          label="Birth month"
                          onChange={updateInput}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                        <TextField
                          name="dobDay"
                          variant="outlined"
                          size="small"
                          margin="normal"
                          label="Birth day"
                          onChange={updateInput}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                        <TextField
                          name="dobYear"
                          variant="outlined"
                          size="small"
                          margin="normal"
                          label="Birth year"
                          onChange={updateInput}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                        <TextField
                          name="dodMonth"
                          variant="outlined"
                          size="small"
                          margin="normal"
                          label="Death month"
                          onChange={updateInput}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                        <TextField
                          name="dodDay"
                          variant="outlined"
                          size="small"
                          margin="normal"
                          label="Death day"
                          onChange={updateInput}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                        <TextField
                          name="dodYear"
                          variant="outlined"
                          size="small"
                          margin="normal"
                          label="Death year"
                          onChange={updateInput}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                        <TextField
                          name="litter"
                          variant="outlined"
                          size="small"
                          margin="normal"
                          label="Litter"
                          onChange={updateInput}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                        <TextField
                          name="fatherId"
                          variant="outlined"
                          size="small"
                          margin="normal"
                          label="Father ID"
                          onChange={updateInput}
                        />
                        {parentInfo('father-info')}
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                        <TextField
                          name="motherId"
                          variant="outlined"
                          size="small"
                          margin="normal"
                          label="Mother ID"
                          onChange={updateInput}
                        />
                        {parentInfo('mother-info')}
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                        <InputLabel id="gene1-label">{geneNames.gene1}</InputLabel>
                        <Select
                          labelId="gene1-label"
                          name="gene1"
                          variant="outlined"
                          size="small"
                          value={animalInfo.gene1 || ''}
                          onChange={updateInput}
                        >
                        <MenuItem value={undefined}>NA</MenuItem>
                        {defaultGenes.map(gene => (
                            <MenuItem key={defaultGenes.indexOf(gene)} value={gene}>{gene}</MenuItem>
                          ))}
                        </Select>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                      <InputLabel id="gene2-label">{geneNames.gene2}</InputLabel>
                      <Select
                        labelId="gene2-label"
                        name="gene2"
                        variant="outlined"
                        size="small"
                        value={animalInfo.gene2 || ''}
                        onChange={updateInput}
                      >
                      <MenuItem value={undefined}>NA</MenuItem>
                      {defaultGenes.map(gene => (
                          <MenuItem key={defaultGenes.indexOf(gene)} value={gene}>{gene}</MenuItem>
                        ))}
                      </Select>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                      <InputLabel id="gene3-label">{geneNames.gene3}</InputLabel>
                      <Select
                        labelId="gene3-label"
                        name="gene3"
                        variant="outlined"
                        size="small"
                        value={animalInfo.gene3 || ''}
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
                </div>
            <div className={classes.error}>
              { !validateForm() ? getErrors() : null }

            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={attemptAddAnimal}
            >
              Add Animal
            </Button>
            <Button
              onClick={() => {
                setRedirectToAnimals(true);
              }}
              variant="outlined"
              color="primary"
              className={classes.submit}
            >Back
            </Button>
          </form>
          </CardContent>
          </Card>
        </div>
      </Container >
    </div>
  );
};

export default AddAnimal;
