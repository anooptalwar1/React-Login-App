import React from 'react';
import DataTable from "mui-datatables";

const columns = ["Project Name", "Classes", "Created On", "Description"];

const options = {
    filterType: 'checkbox',
    download: false,
    print: false,
    viewColumns: false,
    filter: false,
    selectableRows: 'none',
    fixedHeader: false,
    sort: false,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 20],
};

function ProjectList(props) {

    return (
        <DataTable
            data={props.data}
            columns={columns}
            options={options}
        />
    );
}

export default ProjectList;
