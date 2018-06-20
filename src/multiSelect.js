/**
 * Created by yangjie on 2018/3/14.
 *
 * 使用说明
 *           myDisabled--禁用
 *           ngModel--选中项id逗号分隔
 *           itemsList--下拉列表（必填）
 *           onChange--ng-model发生改变触发
 *           checksList--选中数组
 *           namesList--选中项name逗号分开
 *           cutMark--每一项默认逗号分隔，可修改
 *
 */

(function () {
  'use strict';

  angular.module('multi.sel',[])
    .directive('multiSelect', function ($timeout) {
      return {
        restrict: 'AE',
        replace: true,
        scope: {
          myDisabled:'=',/*禁用*/
          ngModel: "=",/*选中项id逗号分隔*/
          itemsList: "=",/*下拉列表*/
          onChange: "&",/*ng-model发生改变触发，非必填*/
          checksList: "=",/*选中数组*/
          namesList:'=',/*选中项name逗号分隔*/
          placeTip:"="/*默认显示文字，非必填*/
        },
        template:
        '<div>\n' +
          '<div class="multi-sel-group">\n' +
          
            '<span class="donotSelest sel-span-btn curpnt" ng-click="iconClick(dropdown);" ng-class="{\'csrnalwd\': myDisabled, \'sel-up-bg\': !dropdown, \'sel-down-bg\': dropdown}">\n' +
              '<i class="glyphicon glyphicon-chevron-{{dropdown?\'up\':\'down\'}}">></i>\n' +
            '</span>\n' +

            '<div class="ovfhid">\n' +
              '<input type="text" class="sel-input curdft ellipsis" placeholder={{placeTip||"全部"}} readonly ng-model="namesList" />\n' +
              '<div ng-if="namesList!=\'\'" class="sel-tip">' +
                '<div class="sel-tip-inner">{{namesList.split(\',\').join(\'，\')}}</div>'+
                '<div class="sel-tip-arrow"></div>'+
              '</div>'+
            '</div>\n' +
          
            '<div class="sel-menu" ng-class="{in: dropdown}" ng-blur="dropdown = false">\n' +
              '<div class="tlc">\n' +
                '<span class="sel-btn curpnt mr5 donotSelest" type="button" ng-click="clearSelect()">清空</span>\n' +
                '<span class="sel-btn curpnt mr5 donotSelest" type="button" ng-click="selectAll()">全选</span>\n' +
                '<span class="sel-btn curpnt donotSelest" type="button" ng-click="dropdown = false;selection()">确定</span>\n' +
              '</div>\n' +
              '<div class="sel-list" ng-class="{in: dropdown}" ng-blur="dropdown = false">\n' +
                '<ul>'+
                  '<li class="curdft ellipsis" ng-repeat="item in itemsList" ng-click="item.checked = !item.checked">\n' +
                    '<div class="sel-checkbox">\n' +
                      '<input type="checkbox" class="sel-check" ng-checked="item.checked"/>\n' +
                      '<div class="{{item.checked?\'bg-after\':\'bg-before\'}}"></div>\n' +
                    '</div>'+
                    '<span>{{item.name}}</span>\n' +
                  '</li>\n' +
                  '<li ng-if="!itemsList||itemsList.length==0">\n' +
                    '<span>无可选项</span>\n' +
                  '</li>\n' +
                '</ul>'+
             '</div>\n' +
            '</div>\n' +
          
          '</div>\n' +
        '</div>\n',
        link: function ($scope,ele,attr) {

          $timeout(function(){
            $scope.cutMark=',';
            $scope.valLists=[];
            $scope.itemsList=angular.isArray($scope.itemsList)?$scope.itemsList:[];
            $scope.selectKeys=$scope.ngModel&&angular.isString($scope.ngModel)?$scope.ngModel.split(','):[];

            _.each($scope.selectKeys,function (it) {
              _.each($scope.itemsList,function (its) {
                if(it==its.id){
                  $scope.valLists.push(its.name);
                }
              });
            });
            $scope.namesList=$scope.valLists.join(attr.cutMark);

          },100);

          //点击打开下拉框
          $scope.iconClick = function (flag) {
            if($scope.myDisabled){
              return false
            }
            $scope.dropdown = !$scope.dropdown;
            if(flag)return;
            _.map($scope.itemsList,function (obj) {
              obj.checked=false;
              return obj;
            });
            _.each($scope.selectKeys,function (it) {
              _.each($scope.itemsList,function (its) {
                if(it==its.id){
                  its.checked=true;
                }
              });
            });
          };

          //清空车型复选框
          $scope.clearSelect = function(){
            _.map($scope.itemsList,function (obj) {
              obj.checked=false;
              return obj;
            });
          };

          //全选
          $scope.selectAll = function() {
            _.map($scope.itemsList,function (obj) {
              obj.checked=true;
              return obj;
            });
          };

          //确认勾选车型复选框
          $scope.selection = function() {
            var isCheck=_.reject($scope.itemsList,function (it) {
              return it.checked!==true;
            });
            $scope.checksList=isCheck;
            $scope.valLists=[];
            $scope.selectKeys=[];
            _.each(isCheck,function (its) {
              $scope.selectKeys.push(its.id);
              $scope.valLists.push(its.name);
            });
            $scope.namesList=$scope.valLists.join(attr.cutMark);
            $scope.ngModel=$scope.selectKeys.join(attr.cutMark);
          };

          //监听model变化
          var destoryM=$scope.$watch('ngModel',function (n,o) {
            if(n!=o){
              $scope.onChange&&$scope.onChange();
            }
          });
          $scope.$on('$destroy',function () {
            destoryM();
          });

        }
      };
    });
})();
