import Vue from 'vue';
import {
    Button, Icon, Toast, CountDown, Badge,
    Form, Field,
    Col, Row,
    Cell, CellGroup,
    Tabbar, TabbarItem, NavBar, IndexBar, IndexAnchor, Tab, Tabs,
    Image as VanImage,
    PullRefresh, SwipeCell,
    Empty, Popup,
    Search
} from 'vant';

const list = [
    Button, Icon, Toast, CountDown, Badge,
    Form, Field,
    Col, Row,
    Cell, CellGroup,
    Tabbar, TabbarItem, NavBar, IndexBar, IndexAnchor, Tab, Tabs,
    VanImage,
    PullRefresh, SwipeCell,
    Empty, Popup,
    Search
];

list.forEach(item => {
    Vue.use(item)
})
