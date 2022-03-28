import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { ButtonContainer, Img, SearchContainer, Form, Input } from "./Styles";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

export default function Admin() {
  const [data, setData] = useState([]);

  const [input, setInput] = useState({
    value: "",
  });

  const { value } = input;

  const handleChanged = ({ target }) => {
    if(target.value===''){
      setInput({
        ...input,
        value:''
      })
      getAll();
    } else {
      setInput({
        ...input,
        [target.name]: target.value,
      });
      axios
        .get(`https://server-games-app.herokuapp.com/games`)
        .then((res) => {
          setData(res.data.filter((e) => e.name.toLowerCase().includes(value)));
        })
        .catch((err) => console.log(`${err}`));
    }
  };

  const getAll = () => {
    axios
      .get(`https://server-games-app.herokuapp.com/games`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAll();
    localStorage.removeItem("id");
  }, []);

  return (
    <>
      <SearchContainer>
        <Form>
        <Input
            name="value"
            type="text"
            value={value}
            placeholder="Busca por nombre"
            autocomplete="off"
            onChange={handleChanged}
          />
        </Form>
      </SearchContainer>

      <ButtonContainer>
        <Link to="/add">
          <Button
            size="large"
            variant="contained"
            color="success"
            href="/add"
            endIcon={<AddCircleIcon />}
          >
            Agregar Nuevo
          </Button>
        </Link>
      </ButtonContainer>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: 35 }} align="center">
                Nombre
              </TableCell>
              <TableCell sx={{ fontSize: 35 }} align="center">
                Precio{" "}
                <MonetizationOnIcon
                  sx={{ pt: 1 }}
                  color="success"
                  fontSize="large"
                />
              </TableCell>
              <TableCell sx={{ fontSize: 35 }} align="center">
                Genero
              </TableCell>
              <TableCell sx={{ fontSize: 35 }} align="center">
                Imagen
              </TableCell>
              <TableCell sx={{ fontSize: 35 }} align="center">
                Plataforma
              </TableCell>
              <TableCell sx={{ fontSize: 35 }} align="center">
                Accion
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((element) => {
              const { id, name, price, genre, cover, platform } = element;
              return (
                <TableRow>
                  <TableCell sx={{ fontSize: 30 }} align="center">
                    {name}
                  </TableCell>
                  <TableCell sx={{ fontSize: 30 }} align="center">
                    {price}
                    <MonetizationOnIcon
                      sx={{ pt: 1 }}
                      color="success"
                      fontSize="large"
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: 30 }} align="center">
                    {genre}
                  </TableCell>
                  <TableCell align="center">
                    <Img src={cover} alt={`${name} cover.`} />
                  </TableCell>
                  <TableCell sx={{ fontSize: 30 }} align="center">
                    {platform}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton>
                      <Link to="/add">
                        <ModeEditIcon
                          color="primary"
                          fontSize="large"
                          onClick={() => {
                            localStorage.setItem("id", id);
                          }}
                        />
                      </Link>
                    </IconButton>
                    <IconButton>
                      <DeleteIcon
                        color="error"
                        fontSize="large"
                        onClick={() => {
                          Swal.fire({
                            title: "Estas seguro?",
                            text: "El juego se eliminará!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#2e7d32",
                            cancelButtonColor: "#f44336",
                            confirmButtonText: "Si, eliminar!",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              axios
                                .delete(
                                  `https://server-games-app.herokuapp.com/games/${id}`
                                )
                                .then(() => {
                                  Swal.fire({
                                    position: "center",
                                    title: "Eliminado!",
                                    text: "EL juego ha sido eliminado.",
                                    icon: "success",
                                    showConfirmButton: false,
                                    timer: 1500,
                                  });
                                  getAll();
                                })
                                .catch((err) => console.log(err));
                            }
                          });
                        }}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
