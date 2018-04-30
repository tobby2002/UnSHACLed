import * as React from 'react';
import {Sidebar, Menu, Image, Input, Button, Label,
    Accordion, Checkbox, Header, Popup, List, Icon} from 'semantic-ui-react';
import {SidebarProps} from './interfaces/interfaces';
import SidebarPopup from './sidebarPopup';

class SideBar extends React.Component<SidebarProps, any> {

    static sidebarOptions = [
        {key: 1, text: 'Add Components', value: 1},
        {key: 2, text: 'Project structure', value: 2}
    ];
    static SHACLMenuItems = ["Shape", "Node Shape", "Property Shape"];
    static GeneralMenuItems = ["Arrow", "Rectangle"];
    static TemplateMenuItems;

    constructor(props: any) {
        super(props);

        this.state = {
            value: '',
            content: 1,
            dragid: null
        };

        /* bind template menu to props */
        SideBar.TemplateMenuItems = this.props.templates;

        this.handleChange = this.handleChange.bind(this);
        this.handleDropDown = this.handleDropDown.bind(this);
        this.getMenuItemsFiltered = this.getMenuItemsFiltered.bind(this);
        this.DynamicMenu = this.DynamicMenu.bind(this);
        this.addTemplateEntry = this.addTemplateEntry.bind(this);
    }

    getMenuItemsFiltered(kind: string, query: string) {
        // determine kind of submenu
        let collection;
        if (kind === "SHACL") {
            collection = SideBar.SHACLMenuItems;
        } else if (kind === "General") {
            collection = SideBar.GeneralMenuItems;
        } else if (kind === "Template") {
            collection = SideBar.TemplateMenuItems;
        } else {
            console.log("error unknow kind of submenu");
        }

        // filter if necessary
        if (query === "") {
            return collection;
        } else {
            return collection.filter(value => {
                return value.toLowerCase().indexOf(query.toLocaleLowerCase()) !== -1;
            });
        }
    }

    /*
     * Used for dynamically building the components in the sidebar
     * In the props must specify the menu type
     */
    DynamicMenu(props: any) {
        let kind = props.kind;
        let query = this.state.value;
        let items = Array<JSX.Element>();
        let res = this.getMenuItemsFiltered(kind, query);

        for (let i = 0; i < res.length; i++) {
            let key = kind + i;
            items.push(
                <SidebarPopup
                    p_size={"mini"}
                    p_position={"right center"}
                    header_title={res[i]}
                    trigger={
                        <Menu.Item
                            as="a"
                            id={res[i]}
                            content={res[i]}
                            key={key}
                        />
                    }
                />
            );
        }

        return (
            <Menu.Menu>
                {items}
            </Menu.Menu>
        );
    }

    handleChange(event: any) {
        this.setState({
            value: event.target.value
        });
    }

    handleDropDown(event: any, data: any) {
        this.setState({
            content: data.value
        });

    }

    addTemplateEntry(entryName: any) {
        let {templateCount} = this.state;
        this.setState({
            templateCount: this.state.templateCount + 1,
            templates: this.state.templates.concat(
                <Menu.Item
                    as="a"
                    content={entryName + templateCount}
                    key={entryName}
                    id={entryName}
                />
            )
        });
    }

    render() {
        const logo = require('../img/logo.png');
        // const defaultOption = 1;
        let {templates} = this.props;
        const rootPanels = [
            {title: 'SHACL', content: {content: <this.DynamicMenu kind="SHACL"/>, key: 'content-1'}},
            {title: 'Template', content: {content: templates, key: 'content-2'}},
        ];

        return (
            <Sidebar
                as={Menu}
                animation='push'
                visible={this.props.visible}
                vertical={true}
                inverted={true}
                borderless={true}
                style={{
                    width: '50h'
                }}
                id="sideBarID"
            >
                {/* Sidebar Logo */}
                <Menu.Item style={{height: '5em'}}>
                    <Image src={logo} size="mini" centered={true}/>
                </Menu.Item>
                {/* Sidebar search box */}
                <Menu.Item style={{backgroundColor: "#3d3e3f"}}>
                    <Input
                        onChange={this.handleChange}
                        type="text"
                        value={this.state.value}
                        placeholder="Search components . . ."
                        inverted={true}
                        transparent={true}
                        icon="search"
                    />
                </Menu.Item>
                {/* Sidebar template button */}
                <Menu.Item>
                    <Button
                        id={"addTemplate"}
                        inverted={true}

                    > Add template from selection
                    </Button>
                    {this.props.showLabel ?
                        <Label
                            basic={true}
                            color='red'
                            pointing={true}
                        >
                            Nothing is selected!
                        </Label> : null
                    }
                </Menu.Item>
                {/* Sidebar accordion submenu */}
                <Accordion
                    defaultActiveIndex={[0, 2]}
                    inverted={true}
                    exclusive={false}
                    fluid={true}
                    panels={rootPanels}
                />
                {/* Sidebar legend */}
                <Menu.Item style={{bottom: 0, position: 'absolute'}}>
                    <Header
                        inverted={true}
                        content="Show Legend"
                        floated="left"
                        size="tiny"
                        style={{verticalAlign: 'middle', fontWeight:'lighter'}}
                    />
                    <Popup
                        trigger={<Checkbox/>}
                        content={
                            <List verticalAlign='middle'>
                                <List.Item>
                                    <Icon style={{ color: '#A1E44D'}} name="square"/>
                                    <List.Content>
                                        <List.Header> Shape </List.Header>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <Icon style={{ color: '#2FBF71'}} name="square"/>
                                    <List.Content>
                                        <List.Header> Property </List.Header>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <Icon style={{ color: '#7D26CD'}} name="square"/>
                                    <List.Content>
                                        <List.Header> Property Attribute </List.Header>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <Icon style={{ color: '#7D26CD'}} name="square"/>
                                    <List.Content>
                                        <List.Header> Data </List.Header>
                                    </List.Content>
                                </List.Item>
                            </List>
                        }
                        on='click'
                        position='right center'
                    />
                </Menu.Item>
            </Sidebar>

        );
    }
}

export default SideBar;