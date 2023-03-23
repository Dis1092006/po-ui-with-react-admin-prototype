import {stringify} from 'qs';
import merge from 'deepmerge';
import axios from 'axios';
// @ts-ignore
import {GET_LIST, GET_ONE, GET_MANY_REFERENCE} from 'ra-jsonapi-client/src/actions';
// @ts-ignore
import defaultSettings from 'ra-jsonapi-client/src/default-settings';
// @ts-ignore
import {NotImplementedError} from 'ra-jsonapi-client/src/errors';
// @ts-ignore
import init from 'ra-jsonapi-client/src/initializer';

init();

const DataProvider = (apiUrl: string, userSettings: object = {}): (type: string, resource: string, params: any) => any => {
    return (type: string, resource: string, params: any) => {
        let url = '';
        const settings = merge(defaultSettings, userSettings);

        const options = {
            // @ts-ignore
            headers: settings.headers,
        };

        switch (type) {
            case GET_LIST: {
                const {page, perPage} = params.pagination;
                const query = {
                    'page[size]': perPage,
                    'page[number]': page,
                };
                const operators = {'_gte': 'strictly_after', '_lte': 'strictly_before'};
                const filter = params.filter;

                Object.keys(filter || {}).forEach((key) => {
                    let valueArray;
                    let value = params.filter[key];
                    if (value.constructor.name === 'String') {
                        valueArray = value.split(",").map(function (item: string) {
                            return item.trim();
                        });
                    } else if (value.constructor.name === 'Array') {
                        valueArray = value;
                    }
                    if (valueArray.length > 1) {
                        let numCallbackRuns = 0;
                        valueArray.forEach((element: any) => {
                            numCallbackRuns++;
                            // @ts-ignore
                            query[`filter[${key}][${numCallbackRuns}]`] = element;
                        })
                        return;
                    }

                    // @ts-ignore
                    const operator = operators[key.slice(-4)];
                    if (operator) {
                        let dateValue = params.filter[key];
                        if (operator === 'strictly_before') {
                            dateValue += ' 23:59:59';
                        }

                        // @ts-ignore
                        query[`filter[${key.slice(0, -4)}][${operator}]`] = dateValue;
                    } else {
                        // @ts-ignore
                        query[`filter[${key}]`] = params.filter[key];
                    }
                });

                // Add sort parameter
                if (params.sort && params.sort.field) {
                    const prefix = params.sort.order === 'ASC' ? '' : '-';
                    // @ts-ignore
                    query['sort'] = prefix + params.sort.field;
                }

                url = `${apiUrl}/${resource}?${stringify(query)}`;
                break;
            }

            case GET_ONE:
                url = `${apiUrl}/${resource}/${params.id}`;
                break;

            case GET_MANY_REFERENCE: {
                const {page, perPage} = params.pagination;

                // Create query with pagination params.
                const query = {
                    'page[size]': perPage,
                    'page[number]': page,
                };

                // Add all filter params to query.
                Object.keys(params.filter || {}).forEach((key) => {
                    // @ts-ignore
                    query[`filter[${key}]`] = params.filter[key];
                });

                // Add the reference id to the filter params.
                // @ts-ignore
                query['filter'] = `equals(${params.target},'${params.id}')`;

                // Add sort parameter
                if (params.sort && params.sort.field) {
                    const prefix = params.sort.order === 'ASC' ? '' : '-';
                    // @ts-ignore
                    query['sort'] = `${prefix}${params.sort.field}`;
                }

                url = `${apiUrl}/${resource}?${stringify(query)}`;
                break;
            }
            default:
                throw new NotImplementedError(`Unsupported Data Provider request type ${type}`);
        }

        return axios({url, ...options})
            .then((response) => {
                let total;
                if (type === GET_LIST || type === GET_MANY_REFERENCE) {
                    // @ts-ignore
                    if (response.data.meta && settings.total) {
                        // @ts-ignore
                        total = response.data.meta[settings.total];
                    }

                    // Use the length of the data array as a fallback.
                    total = total || response.data.data.length;
                }

                switch (type) {
                    case GET_LIST: {
                        return {
                            // @ts-ignore
                            data: response.data.data.map(value => Object.assign(
                                {id: value.id},
                                value.attributes,
                            )),
                            total,
                        };
                    }

                    case GET_ONE: {
                        const {id, attributes} = response.data.data;

                        return {
                            data: {
                                id, ...attributes,
                            },
                        };
                    }

                    case GET_MANY_REFERENCE: {
                        return {
                            // @ts-ignore
                            data: response.data.data.map(value => Object.assign(
                                {id: value.id},
                                value.attributes,
                            )),
                            total,
                        };
                    }

                    default:
                        throw new NotImplementedError(`Unsupported Data Provider request type ${type}`);
                }
            })
            .catch(function (error) {
                return Promise.reject(new Error(error.message.errors[0].detail));
            });
    };
};
export default DataProvider;
