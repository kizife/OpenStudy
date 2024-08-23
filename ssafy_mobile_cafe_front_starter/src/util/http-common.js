import axios from 'axios';

// name must start with VITE_
const {VITE_REST_API_URL } = import.meta.env;

// axios 객체 생성
export default axios.create({
  baseURL: VITE_REST_API_URL,
  headers: {
    'Content-type': 'application/json;charset=utf-8',
  },
});
