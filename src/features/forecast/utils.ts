import axios from 'axios';
import { Auth } from 'aws-amplify';

const BASE_URL = 'https://1si784c8o0.execute-api.eu-west-1.amazonaws.com/dev';

type ApiResponse<T> = {
  success: true,
  data: T
} | {
  success: false,
  error: string
};

export const awsGet = async <T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> => {
  try {
    const session = await Auth.currentSession();
    const auth = session.getIdToken().getJwtToken();

    const res = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': auth
      },
      params
    });

    return { success: true, data: res.data as T };
  } catch (e) {
    return {
      success: false,
      error: e.response?.data?.error || e.toString()
    };
  }
};

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U]

export const groupByMonth = <T extends { ds: number, y: number | string | null, agg: string }>(data: AtLeastOne<T>[]): T[] => {
  const byMonth = data.reduce((result: { [key: string]: any }, current) => {
    const date = new Date(current.ds);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (result[`${year}.${month}`]) {
      // Merge all values for same year.month except date
      Object.entries(current).forEach(([key, value], i) => {
        // Handle null values for predicted dates
        if (key === 'y' && result[`${year}.${month}`].y !== null) {
          // Handle different types of aggregation
          if (current.agg === 'sum') {
            result[`${year}.${month}`].y += parseFloat(value as string);
          } else {
            // Calculate running average
            result[`${year}.${month}`].y = ((result[`${year}.${month}`].y * i) + parseFloat(value as string)) / (i + 1);
          }
        }
        else if (key !== 'ds' && key !== 'agg') {
          // Handle different types of aggregation
          if (current.agg === 'sum') {
            result[`${year}.${month}`][key] += value;
          } else {
            // Calculate running average
            result[`${year}.${month}`][key] = ((result[`${year}.${month}`][key] * i) + (value as number)) / (i + 1);
          }
        }
      });
    } else {
      // Create property if it's not already there
      result[`${year}.${month}`] = {
        ...current,
        y: !!current.y ? parseFloat(current.y as string) : null
      };
    }
    return result;
  }, {});

  return Object.values(byMonth);
};