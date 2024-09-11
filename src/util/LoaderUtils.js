class LoaderUtils{
    map
    constructor() {
        this.map = {}
    }
    
    createFiiesMap(files) {
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            this.map[file.name] = file;
        }

        return this.map;
    }

    getFilesFromItemList(items, onDone){
        let itemsCount = 0;
        let itemsTotal = 0;

        const files = [];
        const filesMap = {};

        OnEntryHandled = () =>{
            itemsCount ++;
            if (itemsCount === itemsTotal) {
                onDone(files, filesMap);
            }
        }

        HandleEntry = (entry) => {
            if (entry.isDirectory){
                const reader = entry.createReader();
                reader.readEntries((entries) => {
                    for (let index = 0; index < entries.length; index++) {
                        HandleEntry(entries[i]);
                    }
                })
            } else if (entry.isFile) {
                entry.file((file) => {
                    file.push(file);
                    filesMap[entry.fullPath.slice(1)] = file;
                    OnEntryHandled();
                })
            }

            itemsTotal ++;
        }

        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            if (item.kind === 'file') {
                HandleEntry(item.webkitGetAsEntr());
            }
            
        }
    }
    
}

export {LoaderUtils}