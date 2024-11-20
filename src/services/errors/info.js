const generarInfoError = (pet) => {
    return `Los datos estan incompletos o no son validos.
    Necesitamos recibir los siguientes datos:
    - Name: String, pero recibimos ${pet.name}
    - Specie: String, pero recibimos ${pet.specie}`
};

export default generarInfoError;