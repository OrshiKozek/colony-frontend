import React, { useState, useEffect } from 'react';
import ColoniesTable from 'components/ColoniesTable';
import SharedColoniesTable from 'components/SharedColoniesTable';
import { useProfileProvider } from 'contexts/profile';
import PropTypes from 'prop-types';
import { AppBar, Button, Box, TextField, Container, CssBaseline, Grid, Tabs, Tab, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Add from '@material-ui/icons/Add';
import { CopyToClipboard } from 'react-copy-to-clipboard';

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

const tabStyle = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const Colonies = () => {
  const {
    addColony, sortList, sortAlpha, state: { ownedColonies, sharedColonies },
  } = useProfileProvider();
  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('');
  const [geneNames, setGeneNames] = useState({gene1: 'Gene 1', gene2: 'Gene 2', gene3:'Gene 3'});
  const [addDialog, setAddDialogOpen] = React.useState(false);
  const [tab, setTab] = React.useState(0);
  const tabClasses = tabStyle();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  useEffect(() => {
    console.log('OWNED LIST: ', ownedColonies);
    console.log('SHARED LIST: ', sharedColonies);
  });

  const openAddDialog = () => {
    setAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setAddDialogOpen(false);
  };

  /* Uploading File. */
  const chooseFile = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    const reader = new FileReader();

    if (file != null && file.size > 0) {
      reader.readAsText(file);
    } else {
      alert('Please input a file!');
    }

    let check = true;
    // let resData = {};

    reader.onload = async () => {
      const load = reader.result;
      const data = { payload: load, name: fileName, geneNames };
      if (!isBlank(fileName.trim())) {
        const resData = await addColony(data).catch();
        console.log(resData);
        if (resData.fileErrorsFound) {
          alert('Errors found in file! Please click on colony to correct errors.');
        }
      } else {
        check = false;
        alert('Name can not be blank or just spaces!');
      }
    };

    reader.onerror = () => {
      console.log(reader.onerror);
    };

    if (check) {
      closeAddDialog();
    }
  };

  const createNew = async () => {
    const data = { payload: "", name: fileName, geneNames };
    await addColony(data).catch();
    closeAddDialog();
  };

  const isBlank = function (input) {
    if (input.length === 0) {
      return true;
    }
    return false;
  };
  /**
 * Updates input for file name.
 *
 * @param name
 * @param value
 */
  const updateInputFileName = ({ target: { value } }) => {
    setFileName(value);
  };

  const updateGeneNames = ({ target: { name, value } }) => {
    setGeneNames(prevState => ({ ...prevState, [name]: value }));
  };

  const headers = 'mouseId,gender,litter,fatherId,motherId,dobMonth,dobDay,dobYear,dodMonth,dodDay,dodYear,tod,notes,gene1,gene2,gene3';


  const handleSort = (key) => {
    sortList(key);
  };

  const handleAlpha = (key) => {
    sortAlpha(key);
  };

  return (
    <Container component="main">
      <CssBaseline />
      <h1>Home</h1>

      <div className={tabClasses.root}>
        <AppBar position="static">
          <Tabs value={tab} onChange={handleTabChange} aria-label="simple tabs example">
            <Tab label="My Colonies" {...a11yProps(0)} />
            <Tab label="Shared With Me" {...a11yProps(1)} />
          </Tabs>

          <Grid
            justify="flex-end"
            container
            spacing={1}
            alignItems="flex-end"
          >
            <Grid style={{ paddingRight: 10 }} item>
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => {
                handleAlpha('colonyName');
              }}
              >
                Sort by Name
              </Button>
            </Grid>

            <Grid style={{ paddingRight: 10 }} item>
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => {
                handleSort('size');
              }}
              >
                Sort by Size
              </Button>

            </Grid>
            <Grid style={{ paddingRight: 28 }} item>
              <Button startIcon={<Add />} color="inherit" variant="outlined" onClick={openAddDialog}>
                Add Colony
              </Button>
            </Grid>
          </Grid>

          <Dialog open={addDialog} onClose={closeAddDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add Colony</DialogTitle>
            <DialogContent>
              <DialogContentText>
                  Upload an animal colony along with its name.
                  A colony should be in this format along with the headers at the top of the file.
                  Or, enter a name and click "Create New" to add a colony from scratch.
              </DialogContentText>
              <br />
              <DialogContentText>
                mouseId,gender,litter,fatherId,motherId,dobMonth ....
              </DialogContentText>
              <DialogContentText>
                  1,M,L2,111,1110,3,29,2012,-1,-1,-1,NA,,WT,NA,NA
                  10,M,L2,111,1110,3,29,2012,-1,-1,-1,NA,,WT,NA,NA
              </DialogContentText>
              <br />
              <DialogContentText>
                  Click the &lt;Copy Headers&gt; button to copy the full set of headers to your clipboard.
              </DialogContentText>
              <input type="file" name="file" onChange={chooseFile} />
              <div>
                <TextField variant="outlined" margin="dense" size="small" name="colonyName" label="Colony Name" onChange={updateInputFileName} />
              </div>
              <div>
                <TextField variant="outlined" margin="dense" size="small" name="gene1" label="Gene 1 Name" onChange={updateGeneNames} />
              </div>
              <div>
                <TextField variant="outlined" margin="dense" size="small" name="gene2" label="Gene 2 Name" onChange={updateGeneNames} />
              </div>
              <div>
                <TextField variant="outlined" margin="dense" size="small" name="gene3" label="Gene 3 Name" onChange={updateGeneNames} />
              </div>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={createNew} startIcon={<AddCircleRoundedIcon />}>Create New</Button>
              <CopyToClipboard text={headers}>
                <Button variant="outlined"> &lt;Copy Headers&gt; </Button>
              </CopyToClipboard>
              <Button variant="outlined" onClick={uploadFile} startIcon={<CloudUploadIcon />}>Upload</Button>
            </DialogActions>
          </Dialog>

          <TabPanel value={tab} index={0}>
            <ColoniesTable />
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <SharedColoniesTable />
          </TabPanel>
        </AppBar>

      </div>
    </Container >
  );
};

export default Colonies;
