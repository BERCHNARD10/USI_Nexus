class ArrayIterator {
    constructor(items) {
      //Indice de  la lista de elementos
      this.index = 0;
      //Lista de elementos
      this.items = items;
    }
    first() {
      this.index = 0;
  }
    next() {
      //Regresa los elemntos desde la posicion cero 
      if (this.hasNext()) {
        const nextItem = this.items[this.index++];
        console.log("Posicion" , this.index, "item optenido" , nextItem); // Imprimir el elemento obtenido
        return nextItem;
      }
      return null;
    }
    hasNext() {
      //Ebaluar si el indice no ja llegado al limite de los elementos
      return this.index < this.items.length;
    }
  }
  export default ArrayIterator;
