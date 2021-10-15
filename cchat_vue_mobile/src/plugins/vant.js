import Vue from 'vue';
import {
    Button, Icon, Toast, CountDown, Badge,
    Form, Field,
    Col, Row,
    Cell, CellGroup,
    Tabbar, TabbarItem, NavBar, IndexBar, IndexAnchor,
    Image as VanImage,
    PullRefresh, SwipeCell
} from 'vant';

const list = [
    Button, Icon, Toast, CountDown, Badge,
    Form, Field,
    Col, Row,
    Cell, CellGroup,
    Tabbar, TabbarItem, NavBar, IndexBar, IndexAnchor,
    VanImage,
    PullRefresh, SwipeCell
];

list.forEach(item => {
    Vue.use(item)
})
