(function() {

	var ACCESS_IP_ADDR = 'http://139.196.219.162/';

	// 存放已排人员，未排人员
	var alreadySchedule = {},
		unSchedule = {};
		// userInfo = getLocalStorage(USER_INFO, "object"); //获取当前登录的用户信息

	function setTitleDateStr(date) {
		var currentDate;
		if (date === '') {
			currentDate = new Date();
		} else {
			var regdate = date.replace(new RegExp("-", "gm"), "/");
			currentDate = new Date(regdate);
		}
		var dateStr = currentDate.getFullYear() + "年" + (currentDate.getMonth() + 1) + "月" + currentDate.getDate() + "日" + " 星期" + "日一二三四五六".charAt(currentDate.getDay());

		$('#today_show').text(dateStr);

		if (date === "") {
			date = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate()
		}
		getDataList(date);
	}

	// 当前日期
	setTitleDateStr("");
	initMinCalendar('');
	// 初始化日历
	calendarIns = new calendar.calendar({
		count: 3,
		selectDate: new Date(),
		selectDateName: '选定',
		minDate: new Date(),
		maxDate: new Date(+new Date() + 100 * 86400000),
		isShowHoliday: true,
		isShowWeek: false
	});
	// 首次进入，隐藏日历选择
	calendarIns.hide();

	// 日期选中事件
	$.bind(calendarIns, 'afterSelectDate', function(event) {
		var curItem = event.curItem,
			date = event.date,
			dateName = event.dateName;

		calendarIns.setSelectDate(date);
		// 设置头部日期
		setTitleDateStr(date);
		// 初始化小日历
		initMinCalendar(date);
		// 加载数据
		getDataList(date);
		// 隐藏日历
		hideCalendar();

	});

	function initMinCalendar(selectDateStr) {
		// 处理IOS无法识别“-”问题
		selectDateStr = selectDateStr.replace(new RegExp("-", "gm"), "/");
		var selectDate = selectDateStr === "" ? new Date() : new Date(selectDateStr);
		var year = selectDate.getFullYear();
		var month = selectDate.getMonth() + 1;
		var date = selectDate.getDate();
		var yyyymmdd = year + "-" + month + "-" + date;
		var day = selectDate.getDay();
		// 当前日期
		$(".week-" + day).find('i').html(date);
		$(".week-" + day).addClass("cur").data('date', yyyymmdd).siblings().removeClass('cur');

		// 处理星期天
		if (day === 0) {
			day = 7;
		}
		// 大于当前天
		for (var i = day + 1; i <= 7; i++) {
			selectDate.setDate(selectDate.getDate() + 1);
			month = selectDate.getMonth() + 1;
			date = selectDate.getDate();
			yyyymmdd = selectDate.getFullYear() + "-" + month + "-" + date;
			if (i == 7) {
				$(".week-0").find('i').html(date);
				$(".week-0").data('date', yyyymmdd);
			} else {
				$(".week-" + i).find('i').html(date);
				$(".week-" + i).data('date', yyyymmdd);
			}
		}

		// 小于当前天
		selectDate = selectDateStr === "" ? new Date() : new Date(selectDateStr); // 需重置为当前选中日期
		for (var i = day - 1; i > 0; i--) {
			selectDate.setDate(selectDate.getDate() - 1);
			month = selectDate.getMonth() + 1;
			date = selectDate.getDate();
			yyyymmdd = selectDate.getFullYear() + "-" + month + "-" + date;
			$(".week-" + i).find('i').html(date);
			$(".week-" + i).data('date', yyyymmdd);
		}
	}

	$('#prevMonth').on('click', function(event) {
		event.stopPropagation();
		calendarIns.prevMonth();
	});

	$('#nextMonth').on('click', function(event) {
		event.stopPropagation();
		calendarIns.nextMonth();
	});

	$('.tab-container .tab-btn').on('click', function() {
		var $this = $(this);
		$this.addClass('btn-select').siblings().removeClass('btn-select');

		var type = $this.data('type');

		if (type === "yes") {
			setScheduleListHtml(alreadySchedule);
		} else if (type === "no") {
			setScheduleListHtml(unSchedule);
		}
	});

	// 显示日历
	$('#showorhide').on('click', function() {

		$('#calendar').addClass('fadeInDown').removeClass('fadeOutUp');

		$('.hide-calendar').show();
		$('.prev-next-month').show();

		$("#min_calendar").hide();

		$('.tab-container').css('margin-top', '0px');

		calendarIns.show();

		$('.tab-container').hide();
		$('.tab-title').hide();
		$('.man-list').hide();
	});

	// 隐藏日历，显示小日历
	function hideCalendar() {
		$('#calendar').addClass('fadeOutUp').removeClass('fadeInDown');

		$('.hide-calendar').hide();
		$('.prev-next-month').hide();

		$("#min_calendar").show();

		$('.tab-container').css('margin-top', '68px');

		$('.tab-container').show();
		$('.tab-title').show();
		$('.man-list').show();

		// 动画时间持续0.5秒
		setTimeout(function() {
			calendarIns.hide();
		}, 500);
	}
	// $('#hide_calendar').on('click', function() {
	//
	//
	// });

	// 小日历日期点击事件
	$('#min_calendar .week').on('click', function() {
		var $this = $(this);
		$this.addClass('cur').siblings().removeClass('cur');
		var date = $this.data('date');
		// 设置顶部时间显示
		setTitleDateStr(date)
			// 加载数据
		getDataList(date);
	});

	function getDataList(date) {
		// 请求数据
		/*api.ajax({
			'url': ACCESS_IP_ADDR + 'api/v1.0/journey/findStaff4Schedule?studioId=' + userInfo.merchantId + '&date=' + date,
			'method': 'get'
		}, function(ret, err) {
			var result = ret.result;
			alreadySchedule = {
				list: resoleImgUrl(result.schedule)
			};
			unSchedule = {
				list: resoleImgUrl(result.unSchedule)
			};
			setScheduleListHtml(unSchedule);
		});*/
		$.ajax({
			url: ACCESS_IP_ADDR + 'api/v1.0/journey/findStaff4Schedule?studioId=1&date=' + date,
			type: 'get',
			dataType: 'json',
			success: function(data) {
				var result = data.result;
				alreadySchedule = {
					list: resoleImgUrl(result.schedule)
				};
				unSchedule = {

					list: resoleImgUrl(result.unSchedule)

				};
				setScheduleListHtml(unSchedule);
			}
		});
	}

	function resoleImgUrl(list) {
		var newList = [];
		if (list.length > 0) {
			for (index in list) {
				var item = list[index];
				item.avatar = item.avatar === "" ? "" : ACCESS_IP_ADDR + item.avatar;
				newList.push(item);
			};
		}
		return newList;
	}

	function setScheduleListHtml(data) {
		var html = template('temp_list', data);
		$('#listContainer').html(html);
	}

})();