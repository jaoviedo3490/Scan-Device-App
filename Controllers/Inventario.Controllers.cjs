
const ConectionBD = require('../Services/DataBase/Conection.cjs');

class Inventario {
    static #instance = null;
    constructor() {
        console.log("Instanciando la BD");
    }
    static getInstance() {
        try {
            if (!this.#instance) {
                this.#instance = new ConectionBD();
            }
            return this.#instance;
        } catch (error) {
            return { statusCode: 500, message: `Ocurrio un error al instanciar la clase Inventario` }
        }
    }

    async createInventario(payload) {
        try {
            const BD_Instance = ConectionBD.getInstance();
            const newItemInventory = await BD_Instance.inventario.create({
                data: { source: JSON.stringify(payload) }
            });
            return { statusCode: 201, message: "Inventario Creado", response: newItemInventory }
        } catch (error) {
            return { statusCode: 500, message: `Ocurrio un error al guardar el inventario: ${error.message}` }
        }
    }
    async getInventario() {
        try {
            const BD_Instance = ConectionBD.getInstance();
            const ItemInventory = await BD_Instance.inventario.findMany();
            return { statusCode: 200, data: ItemInventory }
        } catch (error) {
            return { statusCode: 500, message: `Ocurrio un error al leer el inventario: ${error}` }
        }
    }
    async delInventario(id) {
        try {
            const BD_Instance = ConectionBD.getInstance();
            const delElement = await BD_Instance.inventario.deleteMany({
                where: {
                    id: Number(id)
                }
            });
            return { statusCode: 200, message: JSON.stringify(delElement) };
        } catch (error) {
            return { statusCode: 500, message: `Ocurrio un error al eliminar el registro del inventario: ${error}` }
        }
    }
}

module.exports = Inventario;