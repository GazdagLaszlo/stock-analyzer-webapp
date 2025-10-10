import axiosInstance from "./axios.config.ts";
import { 
    Configuration,
    PortfolioApi, 
    PortfolioItemApi, 
    StockApi, 
    TransactionApi, 
    UserApi, 
    WatchListApi,
    WatchListItemApi,
} from "../../generated-sources/openapi";

const User = new UserApi(new Configuration({basePath: ' '}), undefined, axiosInstance);
const Stock = new StockApi(new Configuration({basePath: ' '}), undefined, axiosInstance);
const Portfolio = new PortfolioApi(new Configuration({basePath: ' '}), undefined, axiosInstance);
const Transaction = new TransactionApi(new Configuration({basePath: ' '}), undefined, axiosInstance);
const WatchList = new WatchListApi(new Configuration({basePath: ' '}), undefined, axiosInstance);
const PortfolioItem = new PortfolioItemApi(new Configuration({basePath: ' '}), undefined, axiosInstance);
const WatchListItem = new WatchListItemApi(new Configuration({basePath: ' '}), undefined, axiosInstance);

const api = {
    User,
    Stock,
    Portfolio,
    Transaction,
    WatchList,
    PortfolioItem,
    WatchListItem,
};

export default api;