import React, { useState } from 'react';
import { useProfileProvider } from 'contexts/profile';
import { Redirect } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

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

const tableStyle = makeStyles({
  table: {
    width: '100%',
    minWidth: 500,
    marginTop: 8,
  },
});

const SharedColoniesTable = () => {
  const { deleteColony, getAnimals, state: { sharedColonies } } = useProfileProvider();
  const classes = tableStyle();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [redirectToAnimals, setRedirectToAnimals] = useState(false);
  const [deleteDialog, setDeleteDialogOpen] = React.useState(false);
  const [deletedColony, setDeletedColony] = useState('');
  const [permission, setPermission] = useState(false);


  const openDeleteDialog = (id, accessRights) => {
    setDeletedColony(id);
    setPermission(accessRights);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const deleteEntry = async () => {
    if (permission) {
      await deleteColony(deletedColony, true).catch(function(error) {
        console.error(error);
      });
    } else {
      console.log('User does not have write access');
    }
    closeDeleteDialog();
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCellClick = async (colonyId, colonyName, colonySize, geneNames, accessRights) => {
    const request = {
      colonyId, rowsPerPage, page,
    };

    await getAnimals(request, accessRights, colonyName, colonySize, geneNames).catch(function(error) {
        console.error(error);
      });
    setRedirectToAnimals(true);
  };

  if (redirectToAnimals) {
    return <Redirect to="/dashboard/colony" />;
  }

  return (
    <TableContainer className={classes.table} component={Paper}>
      <Table className={classes.table} aria-label="custom pagination table">
        <TableBody>
          {(rowsPerPage > 0
            ? sharedColonies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : sharedColonies
          ).map(colony => (
            <TableRow key={colony.colonyId}>
              <TableCell
                style={{ cursor: 'pointer' }}
                component="th"
                scope="row"
                onClick={async () => await handleCellClick(colony.colonyId, colony.colonyName, colony.size, colony.geneNames, colony.accessRights).catch(function(error) {
                  console.error(error);
                })}
              >
                <div style={{ fontWeight: 'bold', fontSize: 18 }}>{colony.colonyName}</div>
                <p style={{ color: '#333333' }}>Size: {colony.size}</p>
                <p style={{ color: '#333333' }}>Permissions: { colony.accessRights ? 'Read and Write' : 'Read Only' }</p>
              </TableCell>
              <TableCell align="right">
                <Button variant="contained" color="primary" onClick={() => openDeleteDialog(colony.colonyId, colony.accessRights)}>Remove</Button>
                <Dialog open={deleteDialog} onClose={closeDeleteDialog} aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">Are you sure you want to delete?</DialogTitle>
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={async () => {
                        await deleteEntry().catch(function(error) {
                          console.error(error);
                        });
                      }}
                    >
                    Delete
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
              count={sharedColonies.length}
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

export default SharedColoniesTable;
