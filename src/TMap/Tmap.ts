import request from 'request-promise-native';
import { PayloadValidationError } from '../infra/PayloadValidationError';
import { ApplicationConfig } from '../infra/ApplicationConfig';

export class Tmap {
  private readonly url: string;

  constructor(longitude: string, latitude: string, searchKeyword = '주유소', radius = true) {
    if (!longitude || !latitude) {
      throw new PayloadValidationError();
    }
    this.url = `https://apis.openapi.sk.com/tmap/pois/search/around?version=1&categories=${encodeURI(searchKeyword)}&centerLon=${longitude}&centerLat=${latitude}&${radius ? 'radius=5' : ''}&appKey=${ApplicationConfig.getTmapApiKey()}`;
  }

  async search() {
    const response = JSON.parse(await request(this.url));
    const data = response.searchPoiInfo.pois.poi.map((e) => ({
      name: e.name,
      addr: `${e.upperAddrName} ${e.middleAddrName} ${e.lowerAddrName} ${e.roadName} ${e.buildingNo1}${e.buildingNo2 && Number(e.buildingNo2) ? ` ${e.buildingNo2}` : ''}`,
      longitude: e.frontLon,
      latitude: e.frontLat,
      radius: e.radius,
    }));
    return data;
  }
}
