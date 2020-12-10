import React, { useState } from 'react';
import { useProfileProvider } from 'contexts/profile';
import { Redirect } from 'react-router-dom';
import { Button, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Share from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const paginationStyle = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = paginationStyle();
  const theme = useTheme();
  const {
    count, page, rowsPerPage, onChangePage,
  } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };


  return (

    <div className={classes.root}>

      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1, 1, 0, 0),
  },
}));

const tableStyle = makeStyles({
  table: {
    width: '100%',
    minWidth: 500,
    marginTop: 8,
  },
});

const ColoniesTable = () => {
  const {
    deleteColony, shareColony, getAnimals, state: { ownedColonies },
  } = useProfileProvider();
  const classes = tableStyle();
  const radioStyle = useStyles();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [redirectToAnimals, setRedirectToAnimals] = useState(false);
  const [shareDialog, setShareDialogOpen] = React.useState(false);
  const [sharedUser, setSharedUserEmail] = useState('');
  const [sharedColony, setSharedColony] = useState('');
  const [deleteDialog, setDeleteDialogOpen] = React.useState(false);
  const [deletedColony, setDeletedColony] = useState('');
  const [accessRightsShare, setAccessRights] = React.useState(false);

  const openShareDialog = (id) => {
    setSharedColony(id);
    setAccessRights(false);
    setShareDialogOpen(true);
  };

  const closeShareDialog = () => {
    setShareDialogOpen(false);
  };

  const openDeleteDialog = (id) => {
    setDeletedColony(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const updateInputSharedUser = ({ target: { value } }) => {
    setSharedUserEmail(value);
  };

  const share = async () => {
    const data = { email: sharedUser, colonyId: sharedColony, accessRights: accessRightsShare };
    await shareColony(data).catch(function(error) {
      console.error(error);
    });
    closeShareDialog();
  };

  const deleteEntry = () => {
    deleteColony(deletedColony, false);
    closeDeleteDialog();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCellClick = async (colonyId, colonyName, colonySize, geneNames, rowsPerPage, page) => {
    const request = {
      colonyId, rowsPerPage, page,
    };
    console.log(colonyId);
    await getAnimals(request, true, colonyName, colonySize, geneNames).catch(function(error) {
      console.error(error);
    });
    setRedirectToAnimals(true);
  };


  const handleRadioChange = (event) => {
    setAccessRights((event.target.value === 'write'));
  };

  if (redirectToAnimals) {
    return <Redirect to="/dashboard/colony" />;
  }

  return (
    <TableContainer className={classes.table} component={Paper}>
      <Table className={classes.table} aria-label="custom pagination table">
        <TableBody>
          {(rowsPerPage > 0
            ? ownedColonies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : ownedColonies
          ).map(colony => (
            <TableRow key={colony.colonyId}>
              <TableCell
                style={{ cursor: 'pointer' }}
                component="th"
                scope="row"
                onClick={async () => await handleCellClick(colony.colonyId, colony.colonyName, colony.size, colony.geneNames, rowsPerPage, page).catch(function(error) {
                  console.error(error);
                })}
              >
                <div style={{ fontWeight: 'bold', fontSize: 18 }}>{colony.colonyName}</div>
                <p style={{ color: '#333333' }}>Size: {colony.size}</p>
              </TableCell>
              <TableCell align="right">
                <Button variant="contained" color="primary" startIcon={<Share />} onClick={() => openShareDialog(colony.colonyId)}>Share</Button>
                <Dialog open={shareDialog} onClose={closeShareDialog} aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">Share with others</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Share animal colony with another user.
                  </DialogContentText>
                    <div>
                      <TextField variant="outlined" margin="dense" size="small" name="email" label="Person to share" onChange={updateInputSharedUser} />
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <RadioGroup aria-label="quiz" name="quiz" onChange={handleRadioChange} defaultValue="read_o">
                      <FormControlLabel value="read_o" control={<Radio />} label="Read Only" />
                      <FormControlLabel value="write" control={<Radio />} label="Read and Write" />
                    </RadioGroup>
                    <Button onClick={async () => await share().catch(function(error) {
                      console.error(error);
                    })
                    } variant="outlined" color="primary" className={radioStyle.button}>
                      Share
                  </Button>

                  </DialogActions>
                </Dialog>

                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    openDeleteDialog(colony.colonyId);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <Dialog
                  open={deleteDialog}
                  onClose={closeDeleteDialog}
                >
                  <DialogTitle>Confirm Delete</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to delete this colony?
                    </DialogContentText>
                  </DialogContent>
                  {console.log("opened delete dialog")}
                  <DialogActions>
                    <Button onClick={deleteEntry} color="primary">
                      Delete
                    </Button>
                    <Button onClick={closeDeleteDialog} color="primary" autoFocus>
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[]}
              colSpan={3}
              count={ownedColonies.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default ColoniesTable;
