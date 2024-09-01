class TagHelper {
  #tag
  constructor(tag){
    this.#tag = tag
  }

  get tag(){
    return this.#tag
  }

  /**
 * Takes a list of object and finds the object with specified tags
 * @param {Array} objects 
 * @param {String} tag 
 * @returns 
 */
  FindObjectsWithTag(objects) {
    const fileteredObjects = objects.filter(object => object.object.tag === this.#tag)
    return fileteredObjects
  }


  /**
 * Adds tag to a object
 * @param {*} object 
 * @param {String} tag 
 */
  AddTag(object){
    object.tag = this.#tag
    object.children.forEach((child) => {
      this.AddTag(child, this.#tag);
    });
  }
}

export default TagHelper