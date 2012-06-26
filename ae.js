;(function(){
	var Form = function(){
		var self = this;
		self.forecastButton = $('.b-ae__forecast')
		self.form = $('.b-ae__inputs-holder');
		self.addButton = $('.b-ae__add-subject');
		self.itemsList = [];
		self.init();
	}
	Form.prototype = {
		BASE_URL        : 'http://abit.org.ua',
		DEFAULT_FILTERS : '/page:1/sort:chanceDown/chance:10',
		SUBJECTS : [
			{"id":1,   "name": "Українська мова та література"},
			{"id":2,   "name": "Історія України"},
			{"id":3,   "name": "Англійська мова"},
			{"id":4,   "name": "Німецька мова"},
			{"id":5,   "name": "Іспанська мова"},
			{"id":6,   "name": "Французька мова"},
			{"id":7,   "name": "Географія"},
			{"id":11,  "name": "Математика"},
			{"id":12,  "name": "Фізика"},
			{"id":13,  "name": "Хімія"},
			{"id":53,  "name": "Біологія"},
			{"id":230, "name": "Російська мова"}
		],
		init:function(){
			var self = this
				, firstSelect = $('select');
			self.subjects = (function(){
				var result = [];
				self.SUBJECTS.forEach(function(elem,index){
					if(self.conf.ukrLangId != elem.id){//do not include ukr lang
						result.push(elem.name);
					}
				});
				return result;
			})();
			//validate on keypress
			$('input').live('keydown',function(e){
				setTimeout(function(){
					if(e.target.value.length >= 3)
						self._validate($(e.target));
					if(e.target.value.length === 0)
						self._validate($(e.target));
				},0);
				return self._validateKeyPress(e);
			});
			self.addButton.bind('click', function(){
				$(this).hide();
				self._addItem();
				return false;
			});
			self.forecastButton.bind('click', self.getResult.bind(this));
		},
		conf: {
			selectItem: '<div class="b-ae__input-item">' +
										'<label class="e-label"></label>' +
										'<select class="e-select"></select> ' +
									'</div>', 
			inputItem: '<input type="text" name="" class="e-textbox"/>',
			defaultSubject: 'Оберіть предмет',
			requiredSubjectsCount: '2',
			ukrLangId: 1
		},
		_addItem: function(){
			var self          = this
				, item          = $(self.conf.selectItem)
				, select        = item.find('select')
				, label         = item.find('label')
				, input         = $(self.conf.inputItem);
			self.subjects.sort();
			//selected input event
			select.one('change',function(){
				self.subjects.splice(self.subjects.indexOf(select.val()),1);
				label.text(select.val());
				select.remove();
				item.append(input);
				input.focus();
				if(!(self.itemsList.length === +self.conf.requiredSubjectsCount)){
					self.addButton.show();
				}
			});
			//add default subject
			select.append($('<option>'+self.conf.defaultSubject+'</option>'))
			self.subjects.forEach(function(elem){
				select.append($('<option>' + elem + '</option>'))
			});
			self.itemsList.push(item);
			item.insertBefore(self.addButton);
			if(self.itemsList.length === +self.conf.requiredSubjectsCount){
				self.addButton.hide();
			}
		},
		getResult: function(){
			var self = this
				, itemsList = $('.b-ae__input-item')
				, isValid = true
				, result = [];
			Array.prototype.forEach.call(itemsList,function(item){
				var input = $(item).find('input')
					, label = $(item).find('label');
				if(!self._validate(input)){
					isValid = false;
				}else{
					result.push([input.val(),label.text()]);
				}
			});
			if(isValid){
				self._changeHash(result);
			}
			else return false;
		},
		_changeHash:function(postData){
			var self     = this
				, hash     = '#id_list:'
				, sumBall  = self._getSumBall(postData)
				, postData = postData.slice(1)//cut the atestat
			postData.forEach(function(elem,index){
				if(index === postData.length - 1){
				hash += self._getSubjectId(elem[1]);
				} else
				hash += self._getSubjectId(elem[1]) + ',';
			});
			hash += '/ball:' + sumBall;
			this.forecastButton.attr( 'href', this.BASE_URL + hash + this.DEFAULT_FILTERS);
		},
		_getSumBall:function(postData){
			var self = this
				, sum = 0;
			postData.forEach(function(elem){
				sum += +elem[0];
			});
			return sum;
		},
		_getSubjectId:function(name){
			var self = this,
				result;
			self.SUBJECTS.forEach(function(elem){
				if ((elem.name == name)&&(elem.name !== 'Атестат')){
					result = elem.id;
				}
			});
			return result;
		},
		_clear: function(target){
			var self = this;
			$(target).css('border-color','');
		},
		_validate:function(target){
			var self = this
				, inputsList =  $('input')
				, pattern = new RegExp()
				, result = false;
			if(!(pattern.test(target.val())&&+target.val()<=200&&+target.val()>=124)){
				target.css('border-color','red');
				result = false;
			}else{
				target.css('border-color','');
				result = true;
			}
			return result;
		},
		_validateKeyPress:function(e){
			var key = e.charCode || e.keyCode || 0;
			// allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
			return (
			key == 8 ||
			key == 9 ||
			key == 46 ||
			(key >= 37 && key <= 40) ||
			(key >= 48 && key <= 57))
		}
	}
	jQuery(function(){
		new Form();
	})
})();
if (!Function.prototype.bind) {  
	Function.prototype.bind = function (oThis) {  
		if (typeof this !== "function") {  
		// closest thing possible to the ECMAScript 5 internal IsCallable function  
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");  
		}  

		var aArgs = Array.prototype.slice.call(arguments, 1),   
		fToBind = this,   
		fNOP = function () {},  
		fBound = function () {  
			return fToBind.apply(this instanceof fNOP  
			? this  
			: oThis,  
			aArgs.concat(Array.prototype.slice.call(arguments)));  
		};  

		fNOP.prototype = this.prototype;  
		fBound.prototype = new fNOP();  

		return fBound;  
	};  
} 
// Production steps of ECMA-262, Edition 5, 15.4.4.18  
// Reference: http://es5.github.com/#x15.4.4.18  
if ( !Array.prototype.forEach ) {  

	Array.prototype.forEach = function( callback, thisArg ) {  

		var T, k;  

		if ( this == null ) {  
			throw new TypeError( "this is null or not defined" );  
		}  

		// 1. Let O be the result of calling ToObject passing the |this| value as the argument.  
		var O = Object(this);  

		// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".  
		// 3. Let len be ToUint32(lenValue).  
		var len = O.length >>> 0; // Hack to convert O.length to a UInt32  

		// 4. If IsCallable(callback) is false, throw a TypeError exception.  
		// See: http://es5.github.com/#x9.11  
		if ( {}.toString.call(callback) != "[object Function]" ) {  
			throw new TypeError( callback + " is not a function" );  
		}  

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.  
		if ( thisArg ) {  
			T = thisArg;  
		}  

		// 6. Let k be 0  
		k = 0;  

		// 7. Repeat, while k < len  
		while( k < len ) {  

			var kValue;  

			// a. Let Pk be ToString(k).  
			//   This is implicit for LHS operands of the in operator  
			// b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.  
			//   This step can be combined with c  
			// c. If kPresent is true, then  
			if ( k in O ) {  

			// i. Let kValue be the result of calling the Get internal method of O with argument Pk.  
				kValue = O[ k ];  

				// ii. Call the Call internal method of callback with T as the this value and  
				// argument list containing kValue, k, and O.  
				callback.call( T, kValue, k, O );  
			}  
				// d. Increase k by 1.  
			k++;  
		}  
		// 8. return undefined  
	};  
}  
