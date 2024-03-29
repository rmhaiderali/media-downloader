import { Link } from "react-router-dom";
import classNames from "classnames";
import formatString from "../../server/utils/formatString";
import capitalizeFirstLetter from "../common/utils/capitalizeFirstLetter";

export default function ({ selectedItem, setItem, items, maxCoulmns, gap }) {
  const totalCoulmnsGap = (maxCoulmns - 1) * gap;
  const itemNames = [];

  const toggleItems = items.map((item) => {
    const name = item.name ?? item;
    itemNames.push(name);

    const commonAttributes = {
      key: name,
      tabIndex: name === selectedItem ? -1 : 0,
      style: {
        width: formatString(
          "calc((100% - {0}px) / {1})",
          totalCoulmnsGap,
          maxCoulmns
        ),
      },
      className: classNames(
        "text-decoration-none text-center z-1 toggle-item",
        name === selectedItem && "active"
      ),
    };

    if (item.path)
      return (
        <Link
          {...commonAttributes}
          to={item.path}
          onClick={(e) => e.target.blur()}
        >
          {capitalizeFirstLetter(item.displayName ?? name)}
        </Link>
      );

    return (
      <button
        {...commonAttributes}
        onClick={(e) => !e.target.blur() && setItem(name)}
      >
        {capitalizeFirstLetter(item.displayName ?? name)}
      </button>
    );
  });

  const totalItems = itemNames.length;
  const totalRows = Math.ceil(totalItems / maxCoulmns);
  // console.log({ totalItems, totalRows });

  const itemIndex = itemNames.indexOf(selectedItem);
  const coulmnsInLastRow = totalItems % maxCoulmns || maxCoulmns;
  const isItemInLastRow = totalItems - itemIndex <= coulmnsInLastRow;
  const totalCoulmns = isItemInLastRow ? coulmnsInLastRow : maxCoulmns;
  // console.log({ itemIndex, coulmnsInLastRow, isItemInLastRow, totalCoulmns });

  const itemWidth = 100 / totalCoulmns;
  const currentCoulmn = itemIndex % maxCoulmns;
  const sliderLeft = itemWidth * currentCoulmn;
  // console.log({ itemWidth, currentCoulmn, sliderLeft });

  const itemHeight = 100 / totalRows;
  const currentRow = Math.floor(itemIndex / maxCoulmns);
  const sliderTop = itemHeight * currentRow;
  // console.log({ itemHeight, currentRow, sliderTop });

  return (
    <ul className="nav toggle" style={{ gap: gap + "px" }}>
      <div
        className="slider"
        // prettier-ignore
        style={{
          width: formatString("calc((100% - {0}px) / {1})", (totalCoulmns - 1) * gap, totalCoulmns),
          height: formatString("calc((100% - {0}px) / {1})", (totalRows - 1) * gap, totalRows),
          left: formatString("calc({0}% + {1}px)", sliderLeft, (currentCoulmn * gap) / totalCoulmns),
          top: formatString("calc({0}% + {1}px)", sliderTop, (currentRow * gap) / totalRows),
        }}
      ></div>
      {toggleItems}
    </ul>
  );
}
