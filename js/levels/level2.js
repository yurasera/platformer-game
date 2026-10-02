export default function buatLevel2({
    ground,
    platform,
    collectible,
    enemy,
    goal,
    decoration
}) {
    ground(0, 650, 2200);

    platform(40, 500, 160);
    platform(240, 440, 140);
    platform(430, 500, 140);
    platform(620, 430, 140);
    platform(810, 500, 140);
    platform(1000, 430, 140);
    platform(1190, 500, 140);
    platform(1380, 430, 140);
    platform(1570, 500, 140);
    platform(1760, 430, 140);
    platform(1950, 500, 180);

    collectible("star", 280, 385);
    collectible("star", 470, 465);
    collectible("star", 660, 375);
    collectible("star", 850, 465);
    collectible("star", 1230, 465);
    collectible("star", 1610, 465);

    collectible("diamond", 1040, 370);
    collectible("diamond", 1800, 370);

    enemy(100, 608);
    enemy(570, 608);
    enemy(1480, 608);
    enemy(1730, 608);

    goal(2040, 420);
    decoration();
}