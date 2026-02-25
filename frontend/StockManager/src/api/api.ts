import axiosInstance from './axios.config.ts';
import {
  Configuration,
  PortfolioApi,
  PortfolioItemApi,
  StockApi,
  TransactionApi,
  UserApi,
  WatchListApi,
  WatchListItemApi,
  StockNewsApi,
  StockReportApi,
  StockDataApi,
} from '../../generated-sources/openapi';
import axios from 'axios';
axios.defaults.withCredentials = true;

const User = new UserApi(
  new Configuration({ basePath: ' ' }),
  undefined,
  axiosInstance
);
const Stock = new StockApi(
  new Configuration({ basePath: ' ' }),
  undefined,
  axiosInstance
);
const Portfolio = new PortfolioApi(
  new Configuration({ basePath: ' ' }),
  undefined,
  axiosInstance
);
const Transaction = new TransactionApi(
  new Configuration({ basePath: ' ' }),
  undefined,
  axiosInstance
);
const WatchList = new WatchListApi(
  new Configuration({ basePath: ' ' }),
  undefined,
  axiosInstance
);
const PortfolioItem = new PortfolioItemApi(
  new Configuration({ basePath: ' ' }),
  undefined,
  axiosInstance
);
const WatchListItem = new WatchListItemApi(
  new Configuration({ basePath: ' ' }),
  undefined,
  axiosInstance
);
const StockNews = new StockNewsApi(
  new Configuration({ basePath: ' ' }),
  undefined,
  axiosInstance
);
const StockReports = new StockReportApi(
  new Configuration({ basePath: ' ' }),
  undefined,
  axiosInstance
);
const StockData = new StockDataApi(
  new Configuration({ basePath: ' ' }),
  undefined,
  axiosInstance
);

const api = {
  User,
  Stock,
  Portfolio,
  Transaction,
  WatchList,
  PortfolioItem,
  WatchListItem,
  StockNews,
  StockReports,
  StockData,
};

export default api;
