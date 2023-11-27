const usermodels = {
    getAll: `
    SELECT 
    * 
    FROM 
    netflix_titles`,
    getByID: `
    SELECT
    *
    FROM
    netflix_titles
    WHERE
    id= ?
    ` ,
    addRow:`
    INSERT INTO netflix_titles ( duration_minutes, type, title, show_id)
    VALUES ( ?, ?, ?, ?);`,
    gettitle:`
    SELECT
        *
    FROM
        netflix_titles
    WHERE 
        title=?
        `,
    getupdate:`
    UPDATE
        netflix_titles
    SET
    duration_minutes = ?,
    type = ?,
    title = ?,
    show_id = ?
    WHERE
        id=?`,
    deleteRow:`
    DELETE FROM
        netflix_titles
    WHERE
        id=?`
}

module.exports=usermodels;
