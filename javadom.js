

var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
	mapOption = {
		center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
		level: 3 // 지도의 확대 레벨
	};

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);


// 위성지도를 표시합니다  
var mapTypeControl = new kakao.maps.MapTypeControl();

// 지도 오른쪽 위에 지도 타입 컨트롤이 표시되도록 지도에 컨트롤을 추가한다.
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

/*
kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
	// 클릭한 위치에 마커를 표시합니다 
	addMarker(mouseEvent.latLng);
});


// 지도에 표시된 마커 객체를 가지고 있을 배열입니다
var markers = [];

// 마커 하나를 지도위에 표시합니다 
addMarker(new kakao.maps.LatLng(37.485583, 126.879579));

// 마커를 생성하고 지도위에 표시하는 함수입니다
function addMarker(position) {
	// 마커를 생성합니다
	var marker = new kakao.maps.Marker({
		position: position
	});

	// 마커가 지도 위에 표시되도록 설정합니다
	marker.setMap(map);

	// 생성된 마커를 배열에 추가합니다
	markers.push(marker);
}

// 배열에 추가된 마커들을 지도에 표시하거나 삭제하는 함수입니다
function setMarkers(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

// "마커 보이기" 버튼을 클릭하면 호출되어 배열에 추가된 마커를 지도에 표시하는 함수입니다
function showMarkers() {
	setMarkers(map)
}

// "마커 감추기" 버튼을 클릭하면 호출되어 배열에 추가된 마커를 지도에서 삭제하는 함수입니다
function hideMarkers() {
	setMarkers(null);
}
*/

var geocoder = new kakao.maps.services.Geocoder();

var marker = new kakao.maps.Marker(), // 클릭한 위치를 표시할 마커입니다
	infowindow = new kakao.maps.InfoWindow({ zindex: 1 }); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

// 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
searchAddrFromCoords(map.getCenter(), displayCenterInfo);

//주소검색 입력값을 받고 주소검색.
// function searchAdress(callback) {
// 	var adressInfo = document.seeAdress.sawAdress.value;
// 	// if (!adressInfo) {
// 	// 	alert("주속검색란에 주소를 넣어주세요_jin");
// 	// }

// 	callback(adressInfo);
// 	// return false
// 	// return adressValue;

// };
// searchAdress(searchAdressInfo);

function searchAdress() {
	var adressInfo = document.seeAdress.sawAdress.value;

	geocoder.addressSearch(adressInfo, function (result, status) {
		// 정상적으로 검색이 완료됐으면 
		//console.log(result);
		if (status === kakao.maps.services.Status.OK) {
			var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

			// 결과값으로 받은 위치를 마커로 표시합니다
			var marker = new kakao.maps.Marker({
				map: map,
				position: coords
			});

			// 인포윈도우로 장소에 대한 설명을 표시합니다
			var infowindow = new kakao.maps.InfoWindow({
				content: '<div style="width:150px;text-align:center;padding:6px 0;">' + result[0].address.address_name + '</div>'
			});
			infowindow.open(map, marker);

			// 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
			map.setCenter(coords);
		} else {
			alert("주소를 정확히 입력해 주세요");
		}
	});
};
// 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트를 등록합니다.
kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
	searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
		if (status === kakao.maps.services.Status.OK) {
			console.log(result);
			var detailAddr = !!result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
			detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
			//산지번을 pnu값으로 변경합니다.
			if (result[0].address.mountain_yn == "N") {
				mountain_yn = 1;
			} else {
				mountain_yn = 2;
			}
			//지번을 텍스트 값으로 변경시켜줌
			main_address_no = ("000" + result[0].address.main_address_no).substr(-4, 4);

			if (result[0].address.sub_address_no == 0) {
				sub_address_no = "0000";
			} else {
				sub_address_no = ("000" + result[0].address.sub_address_no).substr(-4, 4);
			}
			//지번 pnu 변경
			var lowAddr2 = mountain_yn + main_address_no + sub_address_no;


			searchAddrFromCoords(mouseEvent.latLng, function (result1, status) {
				if (status === kakao.maps.services.Status.OK) {
					console.log(result1);
					//전체 pnu 값
					var pnu = result1[0].code + lowAddr2;
					let lowAddr1 = "<div>" + "PNU : " + pnu + "</div>";
					let content = '<div class="bAddr">' +
						'<span class="title">법정동 주소정보</span>' +
						detailAddr + lowAddr1 +
						'</div>';

					// 마커를 클릭한 위치에 표시합니다 
					marker.setPosition(mouseEvent.latLng);
					marker.setMap(map);

					// 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
					infowindow.setContent(content);
					infowindow.open(map, marker);
				}
			});
		}
	});
});
// 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'idle', function () {
	searchAddrFromCoords(map.getCenter(), displayCenterInfo);
});

function searchAddrFromCoords(coords, callback) {
	// 좌표로 행정동 주소 정보를 요청합니다
	geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

function searchDetailAddrFromCoords(coords, callback) {
	// 좌표로 법정동 상세 주소 정보를 요청합니다
	geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

// 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
function displayCenterInfo(result, status) {
	if (status === kakao.maps.services.Status.OK) {
		var infoDiv = document.getElementById('centerAddr');
		for (var i = 0; i < result.length; i++) {
			// 행정동의 region_type 값은 'H' 이므로
			if (result[i].region_type === 'H') {
				infoDiv.innerHTML = result[i].address_name + "<div> 법정동코드명: " + result[i].code + "</div>"
				break;
			}
		}
	}
}
var currentTypeId;
function setOverlayMapTypeId(maptype) {
	var changeMaptype;
	// var mapTypes = document.querySelector("#map_type");
	// var mapTypesDistrict = mapTypes.querySelector(".map_type_district");
	// var mapTypesRoad = mapTypes.querySelector(".map_type_road");

	if (maptype === 'use_district') {
		changeMaptype = kakao.maps.MapTypeId.USE_DISTRICT;
		// mapTypesDistrict.value = "지적도 끄기";

	} else if (maptype === "roadview") {
		changeMaptype = kakao.maps.MapTypeId.ROADVIEW;
		// mapTypesRoad.value = "로드뷰 끄기";
	}
	// 이미 등록된 지도 타입이 있으면 제거합니다
	if (currentTypeId) {
		map.removeOverlayMapTypeId(currentTypeId);
	}

	// maptype에 해당하는 지도타입을 지도에 추가합니다
	map.addOverlayMapTypeId(changeMaptype);

	// 지도에 추가된 타입정보를 갱신합니다
	currentTypeId = changeMaptype;

	// 지적도 보이기를 다시 클릭하면 초기화 하는 코드인데 재수정 필요
	// if (mapTypesDistrict.value === "지적도 끄기") {
	// 	map.removeOverlayMapTypeId(currentTypeId);
	// } else if (mapTypesRoad === "로드뷰 끄기") {
	// 	map.removeOverlayMapTypeId(currentTypeId);
	// }


};

function mapTypeFirst() {
	map.removeOverlayMapTypeId(currentTypeId);
}
var pnuS = [];
function addMarker(position) {
	pnuS.push(position);
}
console.log(pnuS);
// pnu값 받아서 callback 함수 사용시 지도 클릭시 바로 개공 표시됨.
var pnuSearch = function (callback) {
	// var pnuS = [];
	var pnu;
	kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
		addMarker(mouseEvent.latLng);
		searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
			if (status === kakao.maps.services.Status.OK) {
				// var detailAddr = !!result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
				// detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';

				//산지번을 pnu값으로 변경합니다.
				if (result[0].address.mountain_yn == "N") {
					mountain_yn = 1;
				} else {
					mountain_yn = 2;
				}
				//지번을 텍스트 값으로 변경시켜줌
				main_address_no = ("000" + result[0].address.main_address_no).substr(-4, 4);

				if (result[0].address.sub_address_no == 0) {
					sub_address_no = "0000";
				} else {
					sub_address_no = ("000" + result[0].address.sub_address_no).substr(-4, 4);
				}
				//지번 pnu 변경
				var lowAddr2 = mountain_yn + main_address_no + sub_address_no;


				searchAddrFromCoords(mouseEvent.latLng, function (result1, status) {
					if (status === kakao.maps.services.Status.OK) {
						//전체 pnu 값
						pnu = result1[0].code + lowAddr2;
						// pnuS.push(pnu);

						callback(pnu);
					}
				});
			}
		});
	});
}; //callback
// console.log(pnuSearch(displayGonsiga));
// console.log(pnu);
window.addEventListener("load", function () {
	var gongsiga = document.querySelector("#gongsiga");
	gongsiga.onclick = function () {
		// for (var i = 0; i < pnuS.length; i++) {
		// displayGonsiga(pnu);
		pnuSearch(displayGonsiga);
		// }

	}
});
function displayGonsiga(pnu) {
	// window.addEventListener("load", function () {
	// var gongsiga = document.querySelector("#gongsiga");
	var httpRequest;
	// gongsiga.onclick = function makeRequest() {
	httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('XMLHTTP 인스턴스를 만들 수가 없어요 ㅠㅠ');
		return false;
	}
	httpRequest.onreadystatechange = alertContents;
	// url = 'http://apis.data.go.kr/1611000/nsdi/IndvdLandPriceService/attr/getIndvdLandPriceAttr?ServiceKey=DCGCLKgxkKvdE%2F%2F3NNZJoNkacYaV%2BJ110w%2B1qi%2Bd9kWwYunxWXyWGJOfTNIZu6q1sqaeBm5p7b6uZQsxaNmqgw%3D%3D&pnu=1111017700102110000&stdrYear=2015&format=xml&numOfRows=10&pageNo=1'
	//토지특성정보 api
	var urlData = 'http://apis.data.go.kr/1611000/nsdi/LandCharacteristicsService/attr/getLandCharacteristics';
	//개별공시지가 api
	// var urlData = 'http://apis.data.go.kr/1611000/nsdi/IndvdLandPriceService/attr/getIndvdLandPriceAttr';
	var serviceKey = "serviceKey=" + "DCGCLKgxkKvdE%2F%2F3NNZJoNkacYaV%2BJ110w%2B1qi%2Bd9kWwYunxWXyWGJOfTNIZu6q1sqaeBm5p7b6uZQsxaNmqgw%3D%3D";
	var pnuV = "&pnu=" + pnu;
	var stdrYear = "&stdrYear=" + 2020;
	var format = "&format=" + 'json'; //xml, json 형식 변경 가능
	var numOfRows = "&numOfRows=" + 10;
	var pageNo = "&pageNo=" + 1;
	//개별공시지가 이용시 쿼리변수
	// var queryParams = '?' + serviceKey + pnuV + stdrYear + format + numOfRows + pageNo;
	var queryParams = '?' + serviceKey + pageNo + numOfRows + pnuV + stdrYear + format;
	var url = urlData + queryParams;
	httpRequest.open('GET', url, true);
	httpRequest.send();
	// }

	var gongsigaJson = new Array();
	function alertContents() {
		try {
			if (httpRequest.readyState === httpRequest.DONE) {
				if (httpRequest.status === 200) {
					//json으로 받아오는 경우
					var response = JSON.parse(httpRequest.responseText);
					console.log(response);
					// console.log(response.indvdLandPrices.field[0].ldCodeNm);

					var responseLandCharacter = response.landCharacteristicss.field[0];
					// var idcodenum = responseLandCharacter.ldCodeNm;
					// var bunji = responseLandCharacter.mnnmSlno;
					// var gimok = responseLandCharacter.lndcgrCodeNm;
					// var acre = responseLandCharacter.lndpclAr;
					// var uselandSchem = responseLandCharacter.prposArea1Nm;
					// var roadSide = responseLandCharacter.roadSideCodeNm;
					// var landShape = responseLandCharacter.tpgrphFrmCodeNm;
					// var landTilt = responseLandCharacter.tpgrphHgCodeNm;
					// var landUse = responseLandCharacter.ladUseSittnNm;
					// var gongsiga = responseLandCharacter.pblntfPclnd;
					//xml 로 데이터 추출시
					// var gongsiga = xmlrequest.getElementsByTagName("pblntfPclnd")[0].firstChild.data; 
					// var stdryear = responseLandCharacter.stdrYear;

					gongsigaJson.push(responseLandCharacter);

					for (let i = 0; i < gongsigaJson.length; i++) {
						document.querySelector(".num" + i).innerHTML = i + 1;
						document.querySelector(".address" + i).innerHTML = gongsigaJson[i].ldCodeNm;
						document.querySelector(".jibun" + i).innerHTML = gongsigaJson[i].mnnmSlno;
						document.querySelector(".gimok" + i).innerHTML = gongsigaJson[i].lndcgrCodeNm;
						document.querySelector(".acre" + i).innerHTML = gongsigaJson[i].lndpclAr;
						document.querySelector(".uselandschem" + i).innerHTML = gongsigaJson[i].prposArea1Nm;
						document.querySelector(".roadside" + i).innerHTML = gongsigaJson[i].roadSideCodeNm;
						document.querySelector(".landshape" + i).innerHTML = gongsigaJson[i].tpgrphFrmCodeNm;
						document.querySelector(".landtilt" + i).innerHTML = gongsigaJson[i].tpgrphHgCodeNm;
						document.querySelector(".landuse" + i).innerHTML = gongsigaJson[i].ladUseSittnNm;
						document.querySelector(".gongsiga" + i).innerHTML = gongsigaJson[i].pblntfPclnd;
						document.querySelector(".stdryear" + i).innerHTML = gongsigaJson[i].stdrYear;
					}
				} else {
					alert('request에 뭔가 문제가 있어요.');
				}
			}
		}
		catch (e) {
			alert('Caught Exception: ' + e.description);
		}
	}
	// });
};

//ajax 예제
/*
window.addEventListener("load", function () {
	var callIndexes = document.querySelector("#callIndex");
	var tableIndexes = document.querySelector("#tableIndex");

	callIndexes.onclick = function () {
		//console.log("진행시켜")

		$.ajaxPrefilter('json', function (options, orig, jqXHR) {
			return 'jsonp';
		});
		$.ajax({
			url: 'http://ecos.bok.or.kr/api/StatisticSearch/sample/json/kr/1/10/010Y002/MM/201101/201106/AAAA11/',
			type: 'GET',
			dataType: 'json',
			success: function (result) {
				makeTable(result);
			},
			error: function (result) {
				console.log("error >> " + $(result).text());
			}
		});

		function makeTable(jsonData) {
			var rows = jsonData.StatisticSearch.row;

			$data = "";

			for (var idx in rows) {
				$data += '<tr><td>' + rows[idx].TIME + '</td><td>' + rows[idx].DATA_VALUE + '</td></tr>';
			}

			$(tableIndexes).append($data);
		}
	};


});
*/

