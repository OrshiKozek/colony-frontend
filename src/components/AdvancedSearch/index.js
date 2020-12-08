import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useProfileProvider } from 'contexts/profile';
import { Button, Breadcrumbs, Card, CardContent, Link, TextField, Grid, Container, CssBaseline, Typography, FormControl, Select, Input, InputLabel, MenuItem, Checkbox, ListItemText } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const { getList } = require('components/Tags/index');

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

const useStylesTag = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 500,
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

const defaultTags = getList().sort();

const AdvancedSearch = () => {
  const classesGrid = gridStyles();
  const classesTwo = useStyles2();
  const classes = useStyles();
  const classesTag = useStylesTag();
  const themeTag = useTheme();
  const { logout, searchAnimals, state } = useProfileProvider();
  const [animalInfo, setAnimalInfo] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedTags, setselectedTags] = React.useState([]);
  const [redirectToAnimals, setRedirectToAnimals] = useState(false);
  const [redirectToResultsPage, setRedirectToResultsPage] = useState(false);
  const [redirectToColonies, setRedirectToColonies] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const { colonyName, colonyId } = state;

  const getErrors = () => {
    var errorString = "";
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => errorString = errorString + val + "\n"
    );
    return errorString;
  }

  const handleTagChange = (event) => {
    setselectedTags(event.target.value);
  }

  const validateForm = () => {
    let valid = true;
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }
  const searchWithCriteria = async(event) => {
    const request = { colonyId: colonyId, searchCriteria: {animalInfo}, tags: selectedTags};
    console.log(request.tags);
    var results = await searchAnimals(request).catch(function(error) {
      console.error(error);
    });
    setSearchResults(results);
    setRedirectToResultsPage(true);
  };

  const updateInput = ({ target: { name, value } }) => {

    setAnimalInfo(prevState => ({ ...prevState, [name]: value }));
    return 0;
  };

  if (redirectToAnimals) {
    return <Redirect to="/dashboard/colony" />;
  } else if (redirectToColonies) {
    return <Redirect to="/dashboard" />;
  } else if(redirectToResultsPage) {
    return (<Redirect to={{
      pathname: "/results",
      state: {results: searchResults}
    }}/>);
  } else if (redirectToLogin) {
    logout();
    return <Redirect to="/" />;
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
            Search for animal(s) in {colonyName}
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
                        <TextField
                          name="gender"
                          variant="outlined"
                          size="small"
                          margin="normal"
                          label="Gender"
                          onChange={updateInput}
                        />
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
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                        <TextField
                          name="gene1"
                          variant="outlined"
                          size="small"
                          margin="normal"
                          label="Gene 1"
                          onChange={updateInput}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                        <TextField
                          name="gene2"
                          variant="outlined"
                          size="small"
                          margin="normal"
                          label="Gene 2"
                          onChange={updateInput}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className={classesGrid.paper}>
                        <TextField
                          name="gene3"
                          variant="outlined"
                          size="small"
                          margin="normal"
                          label="Gene 3"
                          onChange={updateInput}
                        />
                      </div>
                    </Grid>
                    
                  </Grid>
                  <div>
                    <TextField
                      id="filled-full-width"
                      name="text"
                      variant="outlined"
                      size="medium"
                      fullWidth
                      margin="normal"
                      label="Search for Events and Notes"
                      onChange={updateInput}
                    />
                  </div>
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

                </div>
            <div className={classes.error}>
              { !validateForm() ? getErrors() : null }

            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                searchWithCriteria()
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                setRedirectToAnimals(true);
              }}
              variant="outlined"
              color="primary"
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

export default AdvancedSearch;
