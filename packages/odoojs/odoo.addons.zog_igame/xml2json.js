/**
 * @date: 2017-8-1 11:53:30
 * @author: laihuanmin
 * @desc This xml2json can be used in es6 module.I wrote this plugin because there's only CMD module version can
 * be use,and I do not like write React with JQuery.
 *       It's not just parse XML string to json object, but also can parse XML to JSON.
 *       Hope you can enjoy! :P
 * @dependent: xml2json plugin had finished in es2015 environment,and without any JavaScript kit or frame
 *
 */

/**
 * @private
 */
function _getAllAttr(node) {
  var attributes = node.attributes;
  if (node.hasAttributes() === false) {
    return {};
  }
  var result = {};
  for (let attr of attributes) {
    result[attr.name] = attr.value;
  }
  return result;
}

/**
 * @private
 */
function _getContent(node) {
  return node.innerHTML;
}

/**
 * @private
 */
function _getTagName(node) {
  return node.tagName;
}

/**
 * @private
 */
function _getChildren(parent) {
  var childNodes = parent.childNodes;
  var children = [];
  for (let child of childNodes) {
    if (child.nodeType !== 1) {
      continue;
    } else {
      children.push(child);
    }
  }
  return children;
}

/**
 * @private
 */
function _getChildInfo(children) {
  var resultArr = [];
  for (var child of children) {
    var eachChildInfo = {
      tagName: _getTagName(child),
      content: _getContent(child),
      attr: _getAllAttr(child),
      isParent: false,
      hasAttr: child.hasAttributes()
    };
    var subChildren = _getChildren(child);
    if (subChildren.length !== 0) {
      eachChildInfo.isParent = true;
      eachChildInfo.children = _getChildInfo(subChildren);
    }
    resultArr.push(eachChildInfo);
  }
  return resultArr;
}

/**
 * @private
 */
function _renderXMLTree(parent) {
  var parentEle = document.createElement(parent.tagName);
  //append attributes
  if (parent.hasAttr === true) {
    var attributes = parent.attr;
    for (var attrName in attributes) {
      var attrVal = attributes[attrName];
      parentEle.setAttribute(attrName, attrVal);
    }
  }
  //append children
  if (parent.isParent === true) {
    var children = parent.children;
    for (var child of children) {
      parentEle.appendChild(_renderXMLTree(child));
    }
  } else {
    parentEle.appendChild(document.createTextNode(parent.content));
  }
  return parentEle;
}

/**
 * 传入XML字符串转为JSON
 * pass xml string and will return a JSON object
 *
 * @param {string} xmlString
 * @return {object} json
 */
function toJSON(xmlString) {
  var doc = getXmlObject(xmlString);
  return _getChildInfo(doc.childNodes)[0];
}

/**
 * 传入JSON转为XML对象
 * pass JSON object and will return XML Object
 * @param {object} json
 * @return {object} xmlObject
 */
function toXML(json) {
  return _renderXMLTree(json);
}

/**
 * 你需要传递一个XML字符串到形参上,然后会获取到原生操作XML的对象
 * you should pass a XML string content to the first parameter,and it's will return a Object which can maintain XML info
 *
 * @param {string} xmlString
 * @return {object} xmlObject
 */
function getXmlObject(xmlString) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlString, "text/xml");
  return xmlDoc;
}

export { toJSON, toXML, getXmlObject };

export default {
  toJSON,
  toXML,
  getXmlObject
};
