const VCErrors = {
  AlreadyFetchingError: 'AlreadyFetchingError',
  NoMoreRecords: 'NoMoreRecords',
  InvalidApiResponse: 'InvalidApiResponse'
};

let idCnt = 1;

let defaultOptions = {
  removeDuplicate: true
};

class BaseModel {
  constructor(params, id = 'ost_json_api_' + String(idCnt++), options = {}) {
    this.id = id;
    this.extraParams = params;
    this.options = Object.assign({}, defaultOptions, options);
    this.initVals();
  }

  initVals() {
    this.isFetching = false;
    this.hasNextPage = true;
    this.nextPagePayload = null;
    this.results = [];
    this.meta = null;
    this.resultMap = {};
  }

  refresh() {
    this.initVals();
    return this.fetch();
  }

  getParams() {
    let params = {};
    if (this.extraParams) {
      Object.assign(params, this.extraParams);
    }
    if (this.nextPagePayload) {
      Object.assign(params, this.nextPagePayload);
    }
    return params;
  }

  fetch() {
    if (this.isFetching) {
      return Promise.reject({
        code_error: VCErrors.AlreadyFetchingError
      });
    }

    if (!this.hasNextPage) {
      return Promise.reject({
        code_error: VCErrors.NoMoreRecords
      });
    }

    this.isFetching = true;
    return this.fetchFromJsonApi();
  }

  fetchFromJsonApi(){
    //Overwrite
    throw "fetchFromJsonApi";
  }

  dataReceived(response) {
    let data = response.data;
    let meta = data.meta;
    this.nextPagePayload = meta ? meta.next_page_payload : null;
    this.meta = meta;
    this.hasNextPage = this.nextPagePayload ? true : false;
    let dataToAppend = this.processData(response);
    this.isFetching = false;
    return dataToAppend;
  }

  processData(response) {
    let data = response.data;
    let resultType = data.result_type;
    if (!resultType || !data[resultType]) {
      response.code_error = VCErrors.InvalidApiResponse;
      // Invalid response.
      throw response;
    }
    let results = data[resultType];
    if (!(results instanceof Array)) {
      response.code_error = VCErrors.InvalidApiResponse;
      // Invalid response.
      throw response;
    }
    return this.processResults( results, response );
  }

  processResults(results, response) {
    let cleanedUpList = [];
    let cnt = 0,
      len = results.length;
    for (; cnt < len; cnt++) {
      let result = results[cnt];
      let resultId = result.id;

      // Format Data.
      result = this.formatResult(result, response);
      if (!result) {
        // Some wrong entry.
        continue;
      }
      let existingResult = this.resultMap[resultId];
      // Update existing result if available.
      if (existingResult && this.options.removeDuplicate) {
        Object.assign(existingResult, result);
        continue;
      }

      // Add new result.
      this.resultMap[resultId] = result;
      this.results.push(result);
      cleanedUpList.push(result);
    }
    return cleanedUpList;
  }

  formatResult(result, response) {
    return result;
  }

  getAllResults() {
    return this.results;
  }

  clone() {
   //Overwrite
   throw "clone";
  }

}

export { BaseModel, VCErrors };
