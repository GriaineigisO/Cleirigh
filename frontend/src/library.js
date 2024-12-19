export const capitaliseFirstLetter = (str) => {
    if (str) {
        if (str[0] === "d" && str[1] === "e") {
            return str
        } else {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        
    }
}

//places .toUpperCase on str or returns nothing if str is empty
export const capitalise = (str) => {
    if (str) {
        return str.toUpperCase();
    }
}

//converts date format yyy-mm-dd e.g 1995-08-22 into 22 Aug 1995
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
export const convertDate = (date) => {

    if (date === null || date === undefined) {
        return ""
    }
    
    //extracts only the yyyy-mm-dd from the ISO 8601 format
    const datePart = date.split('T')[0]; // '1992-06-01'
    let dateInt = String(parseInt(datePart.replace(/-/g, ''), 10)); // Convert '1992-06-01' to 19920601
    const year = dateInt.slice(0, 4);

    let month = "";
    if (dateInt[4] !== "0") { 
        month = dateInt[4] + dateInt[5]
    } else {
        month = dateInt[5]
    }
    month = months[Number(month) - 1];

    let day = "";
    if (dateInt[6] !== "0") { 
        day = dateInt[6] + (Number(dateInt[7]) + 1)
    } else {
        day = (Number(dateInt[7]) + 1)
    }

    return `${day} ${month} ${year}`;
}

//if no death place is given, N/A is returned
export const deathPlace = (place) => {
    if (place === null) {
        return "N/A"
    }
}

export const convertNumToRelation = (num, sex) => {


        if (num === 0) {
            return "Self";
        }
        if (Number(num) === 1) {
            if (sex === "male") {
                return "Father"
            } else {
                return "Mother";
            }
        }

        if (Number(num) === 2) {
            if (sex === "male") {
                return "Grandfather"
            } else {
                return "Grandmother"
            }
        }

        if (Number(num) === 3) {
            if (sex === "male") {
                return "Great Grandfather"
            } else {
                return "Great Grandmother"
            }
        }

        if (Number(num) > 3) {
            if (sex === "male") {
                return `Great x${num-2} Grandfather`
            } else {
                return `Great x${num-2} Grandmother`
            }
        }

}

//copies all the items, to a new array, but leaves out any duplicates
export function removeDuplicates(array) {
    let newArray = [];
    for(let i = 0; i < array.length; i++) {
        if(newArray.includes(array[i]) === false) {
            newArray.push(array[i]);
        };
    };
    return newArray;
};