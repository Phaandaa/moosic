const trimDate = (date) => {
    if(date){
        return date.slice(0, 10) + ' ' + date.slice(11, 16);
    }
}
export default trimDate;