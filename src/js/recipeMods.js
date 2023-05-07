/********  Parse Ingredients  *********/
//Ingredients
export const parseIngList = list => {
    let ingList = list.split("\n");
    let ingArray = ingList.map(parseIng);
    console.log("ingList: ", ingList);
    return { text: ingList, array: ingArray };
}

const parseIng = ing => {
    let ingObj = {};
    if(!isCharacterALetter(ing.charAt(0))) {
        const firstSpaceIndex = ing.search(" ");
        ingObj.amt = ing.substr(0,firstSpaceIndex).trim();
        let unitObj = findIngUnit(ing);
        if(unitObj) {
            ingObj.unit = unitObj.unit;
            ingObj.name = unitObj.name;
        } else {
            ingObj.name = ing.substr(firstSpaceIndex).trim();
        }
    } else {
        ingObj.name = ing.trim();
    }
    return ingObj;
}

const findIngUnit = ing => {
    let indexOfUnit;
    let unitText;
    let ingName;
    const unitList = ['cups','cup','oz.','teaspoon','tsp','tablespoon','tbsp','cloves','clove','stalks','stalk','Tbsp'];
    if (unitList.some(function(v) {
        unitText = v;
        indexOfUnit = ing.indexOf(v)
        return indexOfUnit >= 0;
    })) {
        ingName  = ing.substr(indexOfUnit+unitText.length).trim();
        return {
            unit: unitText,
            index:indexOfUnit,
            name: ingName
        };
    } else {
        return '';
    }
}

function isCharacterALetter(char) {
    return (/[a-zA-Z]/).test(char)
  }

/********  end Parse Ingredients  *********/

/********  Parse Directions  *********/

//Directions
export const parseDirList = list => {
    //console.log('parseIngList: ', list);
    let dirList = list.split("\n");
    console.log("dirList: ", dirList);
    return dirList;
}
/********  end Parse Directions  *********/


/******* Parse Ing object to edit *******/
export const parseIngObj = obj => {
    return obj
}
/******* end Parse Ing object to edit *******/

/******* Parse Dir array to edit *******/
export const parseDirArr = arr => {
    console.log('recipeMods - parseDirArr', arr)
    return arr.join('\n')
}
/******* end Parse Ing object to edit *******/