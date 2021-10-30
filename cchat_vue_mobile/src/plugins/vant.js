import Vue from 'vue';
import {
  Button,
  Icon,
  Toast,
  CountDown,
  Badge,
  Dialog,
  Form,
  Field,
  Cell,
  CellGroup,
  Tabbar,
  TabbarItem,
  NavBar,
  IndexBar,
  IndexAnchor,
  Tab,
  Tabs,
  Image as VanImage,
  PullRefresh,
  SwipeCell,
  Empty,
  Popup,
  Search,
  Divider,
  Switch,
  Tag,
  Checkbox,
  Popover,
  List,
  ActionSheet,
  NoticeBar,
} from 'vant';

const list = [
  Button,
  Icon,
  Toast,
  CountDown,
  Badge,
  Dialog,
  Form,
  Field,
  Cell,
  CellGroup,
  Tabbar,
  TabbarItem,
  NavBar,
  IndexBar,
  IndexAnchor,
  Tab,
  Tabs,
  VanImage,
  PullRefresh,
  SwipeCell,
  Empty,
  Popup,
  Search,
  Divider,
  Switch,
  Tag,
  Checkbox,
  Popover,
  List,
  ActionSheet,
  NoticeBar,
];

list.forEach(item => {
  Vue.use(item);
});
