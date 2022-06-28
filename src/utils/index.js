import moment from "moment";

const formatDate = (rawDate, dateFormat = "YYYY-MM-DD HH:mm:ss") => {
  return moment(rawDate).format(dateFormat);
};

export { formatDate };
