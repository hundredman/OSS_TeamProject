import axios from 'axios';

// 오픈 API에서 데이터 가져오기
export const fetchDataFromOpenApi = async () => {
  try {
    const response = await axios.get(
      'http://api.kcisa.kr/openapi/API_TOU_052/request', {
        params: {
          serviceKey: '8b023383-2375-4dd2-a484-a4ad2cbcecb2',
          numOfRows: 150,
          pageNo: 1
        }
      }
    );
    return response.data.response.body.items.item;  // 받아온 데이터 배열
  } catch (error) {
    console.error('오픈 API에서 데이터를 가져오는 중 오류 발생:', error);
    return [];
  }
};

// MockAPI.io로 데이터 전송
export const sendDataToMockApi = async (data) => {
  const mockApiUrl = 'https://671241634eca2acdb5f7cc56.mockapi.io/api/endpoint';  // 실제 엔드포인트로 변경

  try {
    const response = await axios.post(mockApiUrl, data);
    console.log('MockAPI에 데이터 전송 완료:', response.data);
  } catch (error) {
    console.error('MockAPI로 데이터 전송 중 오류 발생:', error);
  }
};

// 전체 작업 처리 함수
export const syncData = async () => {
  // Step 1: 오픈 API에서 데이터 가져오기
  const openApiData = await fetchDataFromOpenApi();

  // Step 2: 데이터 변환 (필요 시 필드명 변경)
  const transformedData = openApiData.map((item) => ({
    title: item.title,
    address: item.address,
    tel: item.tel,
    // 필요한 추가 필드들
  }));

  // Step 3: MockAPI.io로 데이터 전송
  for (const item of transformedData) {
    await sendDataToMockApi(item);  // 각 아이템을 개별적으로 MockAPI로 전송
  }

  console.log('데이터 동기화 완료.');
};
