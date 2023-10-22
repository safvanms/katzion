import React, { useEffect, useState } from 'react'
import Header from '../../Components/Header/Header'
import './home.css'
import axios from 'axios'
import { validationSchema } from '../../schemas/FormValidation'
import { useFormik } from 'formik'

export default function Home() {
  const [universityDetails, setUniversityDetails] = useState([])
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 8
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editIndex, setEditIndex] = useState(null)

  // fetching the api and data retrieves
  const fetchDetails = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        'http://universities.hipolabs.com/search?country=United+States',
      )
      setUniversityDetails(response.data)
      setLoading(false)
    } catch (err) {
      console.error(err)
    }
  }

  // fetching on each mount
  useEffect(() => {
    fetchDetails()
  }, [])

  //  searching / filtering the data
  const searchQuery = (e) => {
    setSearchText(e.target.value)
    setCurrentPage(1)
  }

  //  filter the data in according to the searching input
  const filteredUniversities = universityDetails.filter(({ name }) => {
    return name.toLowerCase().includes(searchText.toLowerCase())
  })

  //   pagination logics here
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = filteredUniversities.slice(
    indexOfFirstRow,
    indexOfLastRow,
  )

  const totalPages = Math.ceil(filteredUniversities.length / rowsPerPage)

  //   button logic for next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  //   button logic for previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  //  edit the university details in the table
  const editRow = (index) => {
    setOpen(true)
    setEditMode(true)
    setEditIndex(index)

    // Populate the form fields with data from the selected row
    const selectedUniversity = currentRows[index]
    formik.setValues({
      name: selectedUniversity.name,
      country: selectedUniversity.country,
      web_pages: selectedUniversity.web_pages,
    })
  }

  //    delete university row
  const deleteRow = (index) => {
    const confirmed = window.confirm('Are you sure you want to delete this?')

    if (confirmed) {
      const updatedRows = [...currentRows]
      updatedRows.splice(index, 1)

      // Find the index of the deleted row in the original universityDetails
      const deletedRow = currentRows[index]
      const deletedRowIndex = universityDetails.findIndex(
        (row) => row.name === deletedRow.name,
      )

      // Create a new universityDetails array without the deleted row
      const updatedUniversityDetails = [...universityDetails]
      updatedUniversityDetails.splice(deletedRowIndex, 1)

      setUniversityDetails(updatedUniversityDetails)
    }
  }

  // open dialog
  const openDialog = () => {
    setOpen(true)
  }

  // close dialog
  const closeDialog = () => {
    setOpen(false)
    formik.resetForm()
  }

  // form handling (add / update)
  const formik = useFormik({
    initialValues: {
      name: '',
      country: '',
      web_pages: ''
    },
    validationSchema,
    onSubmit: (values) => {
      if (editMode) {
        // If in edit mode, update the existing row
        const updatedRows = [...currentRows]
        updatedRows[editIndex] = values

        // Update the universityDetails array with the edited row
        const updatedUniversityDetails = [...universityDetails]
        updatedUniversityDetails[indexOfFirstRow + editIndex] = values

        setUniversityDetails(updatedUniversityDetails)
        setEditMode(false)
        setEditIndex(null)
      } else {
        // If not in edit mode, add a new row
        setUniversityDetails([...universityDetails, values])
      }

      closeDialog()
    },
  })


  return (
    <div>
      <Header />
      <div className="search__section">
        <input
          type="text"
          placeholder="Search University here ..."
          onChange={searchQuery}
        />
      </div>

      {/* add university button */}
      <button className="add-btn" onClick={openDialog}>
        Add University
      </button>

      {/* table here */}
      <div className="table_container">
        <div className="table_section">
          <table>
            <thead>
              <tr>
                <th>sl.No</th>
                <th>University</th>
                <th>Country</th>
                <th>Website</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 &&
                currentRows.map(({ country, name, web_pages }, i) => (
                  <tr key={i}>
                    <td>{indexOfFirstRow + i + 1}</td>
                    <td>{name}</td>
                    <td>{country}</td>
                    <td>
                      <a href={web_pages}>{web_pages}</a>
                      {/* {web_pages?.map((url, j) => (
                        <a
                          key={j}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {url}
                        </a>
                      ))} */}
                    </td>
                    <td className="action_keys">
                      <button className="edit_btn" onClick={() => editRow(i)}>
                        Edit
                      </button>
                      <button
                        className="delete_btn"
                        onClick={() => deleteRow(i)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Loading section while fetching */}

          {loading && <p>Please wait for a moment...</p>}

          {/* show no data message if there is no result by the search query */}

          {currentRows.length === 0 && loading === false && (
            <p style={{ textAlign: 'center' }}>Sorry , No results found !</p>
          )}

          {/* Pagination section */}

          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Prev
            </button>
            <p>
              {currentPage} of {totalPages}
            </p>
            <button onClick={nextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Dialog for add / edit university */}
      <div>
        {open && (
          <div className="dialog">
            <div className="dialog-box">
              <h2>{editMode ? 'Edit University' : 'Add New University'}</h2>
              <form onSubmit={formik.handleSubmit}>
                <label>Name:</label>
                <input
                  type="text"
                  placeholder="Enter University name"
                  required
                  {...formik.getFieldProps('name')}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="error">{formik.errors.name}</p>
                )}
                <label>Country:</label>
                <input
                  type="text"
                  placeholder="Enter Country name"
                  required
                  {...formik.getFieldProps('country')}
                />
                {formik.touched.country && formik.errors.country && (
                  <p className="error">{formik.errors.country}</p>
                )}
                <label>Website:</label>
                <input
                  type="text"
                  placeholder="https://"
                  {...formik.getFieldProps('web_pages')}
                />
                {formik.touched.web_pages && formik.errors.web_pages && (
                  <p className="error">{formik.errors.web_pages}</p>
                )}
                <div className="dialog-action-btn">
                  <button type="submit">{editMode ? 'Update' : 'Add'}</button>
                  <button className="cancel" onClick={closeDialog}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
