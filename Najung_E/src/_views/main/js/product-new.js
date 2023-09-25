const form = document.querySelector('form');
const accountVerificationBtn = document.querySelector('#account-verification-button');
const alertSuccessEl = document.querySelector('#alert-success');
const imageUpload = document.querySelector('#imageUpload');
const largeCategoryOptionEl = document.querySelector('#unp-category-large');
const middleCategoryOptionEl = document.querySelector('#unp-category-middle');
const smallCategoryOptionEl = document.querySelector('#unp-category-small');
const NO_CATEGORY_OPTION = '<option value="0">카테고리 선택</option>';
const productNameEl = document.querySelector('#unp-product-name');
const contentEl = document.querySelector('#unp-product-description');
const priceEl = document.querySelector('#unp-standard-price');
const phoneNumberEl = document.querySelector('#phone-number');
const accountHolderEl = document.querySelector('#account-holder');
const bankAccountNumberEl = document.querySelector('#bank-account-number');
const residentRegistrationNumberEl = document.querySelector('#resident-registration-number');
const verificationCodeEl = document.querySelector('#verification-code');
const accountPasswordEl = document.querySelector('#account-password');
const codeSubmitBtn = document.querySelector('#code-submit-button');
const alertEl = document.querySelector('#alert');
const phoneNumberRegExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
const bankAccountNumRegExp = /^\d{6}-\d{2}-\d{6}$/;
const BANK_API_BASE_PATH = '/hanbyeol-banks';

let formData = new FormData();
let hasNoImage = true;
let isAccountValid = false; // 계좌 유효성 검사 결과를 저장할 전역 변수

// === 본인확인(요청) ===
accountVerificationBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  if (!validateInputForAccountVerification()) return;
  alertEl.classList.replace('d-block', 'd-none');

  const data = {
    accountHolder: accountHolderEl.value,
    phoneNumber: phoneNumberEl.value,
    residentRegistrationNumber: residentRegistrationNumberEl.value,
  };

  let result = await callAPI(`${BANK_API_BASE_PATH}/identity`, 'POST', data);
  console.log(result);
  if (result === null) return; // API 호출 실패 시 로직 종료

  verificationCodeEl.classList.toggle('d-none');
});

// === 본인확인(검증) & 계좌번호 유효성 검사 ===
codeSubmitBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const data = {
    phoneNumber: phoneNumberEl.value,
    verificationCode: document.querySelector('#verification-code input').value,
  };

  const result = await callAPI(`${BANK_API_BASE_PATH}/identity/verify`, 'POST', data);
  console.log(result);
  if (result === null) return;

  const _data = populateDataForAccountVerification();
  const _result = await callAPI(`${BANK_API_BASE_PATH}/account/verify`, 'POST', _data);
  console.log(_result);
  if (_result === null) return;

  isAccountValid = true;
  verificationCodeEl.classList.toggle('d-none');
  accountVerificationBtn.classList.toggle('d-none');
  alertSuccessEl.classList.toggle('d-none');
});

//=== 상품 추가하기 ===
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!isAccountValid) {
    // 계좌번호 유효성 검사가 실패한 경우
    alert('계좌번호 유효성 검사를 통과하지 못했습니다.');
    return;
  }

  try {
    validateInputForAddProduct();
    const data = populateFormData(formData);

    const response = await fetch(`/products`, {
      method: 'POST',
      body: data,
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    location.href = `/product/${result.id}`;
  } catch (error) {
    console.error('Error posting products:', error);
  }
});

// formData에 이미지 할당
imageUpload.addEventListener('change', async (e) => {
  console.log(e.target.files[0].type);
  const files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    // 이미지 파일 사이즈 검사
    if (file.size > 1 * 1024 * 1024) {
      alert('파일용량은 최대 1mb입니다.');
      e.target.value = '';
      return;
    }
    // 확장자 검사
    if (!file.type.includes('jpeg') && !file.type.includes('png')) {
      alert('jpeg 또는 png 파일만 업로드 가능합니다!');
      e.target.value = '';
      return;
    }
    hasNoImage = false;
    formData.append('images', file);
  }
  previewImages();
});

// 이미지 미리보기 메서드
function previewImages() {
  let input = document.getElementById('imageUpload');
  let preview = document.getElementById('imagePreview');
  preview.innerHTML = '';

  for (let file of input.files) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let img = document.createElement('img');
      img.src = e.target.result;
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.margin = '10px';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
}

loadCategories();

async function loadCategories() {
  const response = await fetch('/categories/large');
  const largeCategories = await response.json();

  // 라지 카테고리 옵션 생성
  generateCategories(largeCategories, largeCategoryOptionEl);

  // 라지 카테고리 선택 시, 하위 미들 카테고리 옵션 생성
  largeCategoryOptionEl.addEventListener('change', () => {
    const largeCategoryId = largeCategoryOptionEl.value;
    emptyMiddleOptions();
    emptySmallOptions();
    if (largeCategoryId === '0') return;

    const selectedLarge = largeCategories.find((e) => e.id === largeCategoryId);
    generateCategories(selectedLarge.middleCategories, middleCategoryOptionEl);
  });

  const middleCategories = [];
  largeCategories.forEach((large) => {
    middleCategories.push(...large.middleCategories);
  });

  // 미들 카테고리 선택 시, 하위 스몰 카테고리 옵션 생성
  middleCategoryOptionEl.addEventListener('change', () => {
    const middleCategoryId = middleCategoryOptionEl.value;
    emptySmallOptions();
    if (middleCategoryId === '0') return;

    const selectedMiddle = middleCategories.find((e) => e.id === middleCategoryId);
    generateCategories(selectedMiddle.smallCategories, smallCategoryOptionEl);
  });
}

// 카테고리 옵션 생성 함수
function generateCategories(categories, categoryElement) {
  categories.forEach((category) => {
    const optionElement = document.createElement('option');
    optionElement.value = category.id;
    optionElement.textContent = category.name;
    categoryElement.appendChild(optionElement);
  });
}

function emptyMiddleOptions() {
  middleCategoryOptionEl.innerHTML = NO_CATEGORY_OPTION;
}

function emptySmallOptions() {
  smallCategoryOptionEl.innerHTML = NO_CATEGORY_OPTION;
}

// 유효성 검사 함수
function validateInputForAccountVerification() {
  const phoneNumber = phoneNumberEl.value;
  const accountHolder = accountHolderEl.value;
  const bankAccountNumber = bankAccountNumberEl.value;
  const residentRegistrationNumber = residentRegistrationNumberEl.value;
  const password = accountPasswordEl.value;

  const isValidInput =
    showAlertAndReturnFalse(!phoneNumber, '휴대폰번호를 입력해주세요') &&
    showAlertAndReturnFalse(!phoneNumberRegExp.test(phoneNumber), '핸드폰 번호 형식에 일치하지 않습니다.\n(-)을 포함한 휴대폰 번호를 입력해주세요.') &&
    showAlertAndReturnFalse(!accountHolder, '예금주를 입력해주세요') &&
    showAlertAndReturnFalse(!bankAccountNumber, '계좌번호를 입력해주세요') &&
    showAlertAndReturnFalse(!bankAccountNumRegExp.test(bankAccountNumber), '한별은행 계좌번호 형식에 일치하지 않습니다.') &&
    showAlertAndReturnFalse(!residentRegistrationNumber, '주민등록번호를 입력해주세요') &&
    showAlertAndReturnFalse(!password, '계좌 비밀번호를 입력해주세요');

  if (isValidInput) return true;

  return false; // 모든 필드가 유효하다면 true 반환
}

function showAlertAndReturnFalse(condition, message) {
  if (condition) {
    showAlertWithMessage(message);
    return false;
  }
  return true;
}

function showAlertWithMessage(message) {
  alertEl.innerHTML = message;
  alertEl.classList.replace('d-none', 'd-block');
}

function validateInputForAddProduct() {
  if (smallCategoryOptionEl.value === '0') return alert('카테고리를 선택해주세요.');
  if (hasNoImage) return alert('최소 1장의 이미지를 업로드하세요');
}

function populateFormData(_formData) {
  let formData = new FormData();
  for (let pair of _formData.entries()) {
    formData.append(pair[0], pair[1]);
  }

  const smallCategoryId = smallCategoryOptionEl.value;
  const productName = productNameEl.value;
  const content = contentEl.value;
  const price = priceEl.value;
  const phoneNumber = phoneNumberEl.value;
  const accountHolder = accountHolderEl.value;
  const bankAccountNumber = bankAccountNumberEl.value;
  const residentRegistrationNumber = residentRegistrationNumberEl.value;

  formData.append('smallCategoryId', smallCategoryId);
  formData.append('name', productName);
  formData.append('content', content);
  formData.append('price', price);
  formData.append('phoneNumber', phoneNumber);
  formData.append('accountHolder', accountHolder);
  formData.append('bankAccountNumber', bankAccountNumber);
  formData.append('residentRegistrationNumber', residentRegistrationNumber);

  return formData;
}

async function callAPI(url, method, bodyData = null) {
  try {
    const options = {
      method: method,
      headers: { 'Content-Type': 'application/json' },
    };

    // POST 요청인 경우 body 데이터 추가
    if (bodyData !== null) options.body = JSON.stringify(bodyData);

    let response = await fetch(url, options);

    // 서버 응답에 문제가 있다면 에러 처리
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

function populateDataForAccountVerification() {
  const phoneNumber = phoneNumberEl.value;
  const accountHolder = accountHolderEl.value;
  const bankAccountNumber = bankAccountNumberEl.value;
  const password = accountPasswordEl.value;
  const residentRegistrationNumber = residentRegistrationNumberEl.value;

  const data = {
    bankAccountNumber,
    phoneNumber,
    accountHolder,
    residentRegistrationNumber,
    password,
  };
  return data;
}

const sidebarMenu = document.querySelector('#product-new');
sidebarMenu.classList.add('active');
