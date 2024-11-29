export const capitaliseFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

//converts date format yyy-mm-dd e.g 1995-08-22 into 22 Aug 1995
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
export const convertDate = (date) => {

    if (date === null || date === "1000-12-31T00:01:15.000Z") {
        return "N/A"
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